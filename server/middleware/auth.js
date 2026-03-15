import User from "../models/User.js";
import jwt from "jsonwebtoken";

// middleware to protect routes and verify JWT token
export const protectRoute = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log("Error in auth middleware:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};