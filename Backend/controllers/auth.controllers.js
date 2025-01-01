import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genrateTokenAndSetCookie from "../utils/genrateTokens.js";

export const signup = async(req,res) => {
    try{
        const {fullname,username,password,confirmpassword,gender} = req.body;
    
        if(password !== confirmpassword){
            return res.status(400).json({error:"password not matching..."})
        }

        
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({message:"username already exits"})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password,salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        
        const newUser = await User({
            fullname,
            username,
            password:hasedPassword,
            gender,
            profilePic:gender === "male" ? boyProfilePic:girlProfilePic
        })
        
        
        if(newUser){
            //genrate JWT tokens here
            genrateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({error:"Invalid user data"});
        }

    }catch(err){
        console.log("error signing up...");
        res.status(500).json({message:"internal server error"});
    }
}

export const login = async(req,res) => {
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"invalid usrname or password"});
        }

        genrateTokenAndSetCookie(user._id,res);
        console.log("login success");
        
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePic:user.profilePic
        })
    }catch{
        console.log("error loging in....");
        
        res.status(500).json({message:"internal server error"});
    }
}


export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"});
    }catch{
        console.log("error loging out...");
        
        res.status(500).json({message:"internal server error"});
    }
}

