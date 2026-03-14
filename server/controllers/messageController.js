import User from "../models/User.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";


//get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

        //count no. of messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async(user)=>{
            const messages = await Message.find({sender:user._id, receiver:userId, seen:false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true, users:filteredUsers, unseenMessages});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

//get messages for selected user
export const getMessages = async (req, res) => {
    try {
        const {id:selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,reciverId:selectedUserId},
                {senderId:selectedUserId,reciverId:myId}
            ]
        })
        await Message.updateMany({senderId:selectedUserId,reciverId:myId},{seen:true});

        res.json({success:true,messages})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

//api to mark message as seen using message id
export const markMessageAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

//send message to selected user
export const sendMessage = async (req,res)=>{
    try {
        const {text , image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
       let imageUrl;
       if(image){
        //upload image to cloudinary and get the url
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = result.secure_url;
       }
       const newMessage = await Message.create({
        senderId,
        reciverId,
        text,
        image:imageUrl
       })

       res.json({success:true , newMessage});

       //emit the new message to the receiver's socket
       const reciverSocketId = userSocketMap[receiverId];
       if(reciverSocketId){
        io.to(reciverSocketId).emit("newMessage",newMessage);
       }
       res.json({success:true,message:newMessage})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}