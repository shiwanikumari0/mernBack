import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import {mailSender} from "../utils/mailSender.js";
import dotenv from "dotenv";

dotenv.config();
export const signup = async(req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user =await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
        });
      await createdUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            },
        });
        }
         catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Logging")
        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        } else {
            res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const contact = async(req, res) => {
    try{
        const {fullname,email,message}=req.body;
  
           try{
            const mailToContactTeam=await mailSender(
                process.env.TEAM_USER,
                "Message By User",
                `Message by ${fullname}-${message}`
                );
           
           }catch(err){
              console.log(err);
           }
    
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
            `You have requested for query-${message}`
          )
          console.log("Email Res ", emailRes);


          return res.json({
            success: true,
            message: "Email send successfully",
          })

           

 
    }catch(err){
       
     console.error(err);
 
     return res.status(500).json({
         success:false,
         message:'user not created try again',
     })
    
    
    }
};