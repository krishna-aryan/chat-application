import User from "../models/User.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            // Note: Ensure your Message model uses 'sender' or 'senderId' consistently
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

// get messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId }, // Fixed spelling
                { senderId: selectedUserId, receiverId: myId }  // Fixed spelling
            ]
        });

        // Mark messages from this user to me as seen
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}

// send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // Using destructuring for consistency
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Fixed: was using 'result' which was undefined
        }

        const newMessage = new Message({
            senderId,
            receiverId, // Fixed spelling
            text,
            image: imageUrl
        });

        await newMessage.save();

        // Socket logic
        const receiverSocketId = userSocketMap[receiverId]; // Fixed spelling
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // IMPORTANT: Only send ONE response. Removed the duplicate res.json call.
        res.json({ success: true, newMessage });

    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

// Mark single message as seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}
