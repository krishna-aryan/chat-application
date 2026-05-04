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
};

// get messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

// send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text?.trim() && !image) {
            return res.status(400).json({ success: false, message: "Message text or image is required" });
        }

        let imageUrl;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "image",
                    folder: "quickchat/messages"
                });
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload failed, using fallback data URL:", uploadError.message);
                if (typeof image === "string" && image.startsWith("data:image/")) {
                    imageUrl = image;
                } else {
                    return res.status(500).json({
                        success: false,
                        message: `Image upload failed: ${uploadError.message}`
                    });
                }
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || "",
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to send message" });
    }
};

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
};
