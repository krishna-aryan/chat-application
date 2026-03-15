import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//signup a new user
export const signup = async(req, res) => {
    const {fullName,email, password, bio} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({fullName, email, password:hashedPassword, bio});
        // save the user to the database
        await newUser.save();
        const token = generateToken(newUser._id);

        // return consistent property name for frontend
        res.json({success:true, message:"User created successfully", token, userData:newUser});
    } catch (error) {
        console.log("Error creating user:", error.message);
        res.status(500).json({message: error.message , success:false});
    }
}

//login an existing user
export const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userData = await User.findOne({email});
        if(!userData){
            return res.json({success:false, message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,userData.password);
        if(!isPasswordCorrect){
            return res.json({success:false,message:"Invalid credentials"});
        }

        const token = generateToken(userData._id);

        res.json({success:true, message:"Login successful", token, userData});
        
    }catch(error){
        console.log(error.message);
        res.json({ success: false, error: error.message });
    }
}
//controller to check if user is authenticated
export const checkAuth =(req, res) => {
    res.json({success:true, user:req.user});
}

//controller to update user profile details
export const updateProfile = async(req, res) => {
    // allow profilepic, bio, fullName in body
    try {
        const {profilepic, bio, fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilepic){
            updatedUser = await User.findByIdAndUpdate(userId, {fullName, bio}, {new:true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilepic);
            updatedUser = await User.findByIdAndUpdate(userId, {fullName, bio, profilepic:upload.secure_url}, {new:true});
        }
        res.json({success: true, updatedUser});
    } catch (error) {
        console.log("Error updating profile:", error.message);
        res.status(500).json({success: false, message:"Error updating profile", error:error.message});
    }
}