import User from "../models/User.js";


//middleware to protect routes and verify JWT token
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.json({ success : false , message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware:", error.message);
       return res.status(401).json({ message: "Unauthorized", error });
    }
}