import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken"

async function sendToken(user , res, message) {
    const token = jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("token",token)

    res.status(200).json({
        message,
        success:true,
        token,
        user:{
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const register = async (req,res)=>{
   const {fullname , email , password , isGetter,contact}= req.body

   try {
    
       const isUserExist = await userModel.findOne({
        $or:[
            {email},
            {contact}
        ]
       })

       if(isUserExist){
        return res.status(401).json({
            success:false,
            message:"user already exist"
        })
       }

       const user = await userModel.create({
        fullname,
        email,
        password,
        contact,
        role:isGetter?"getter":"user"
       })

       await sendToken(user,res,"Register successfully")
   } catch (error) {
    console.log(error);
    
    return res.status(500).json({message:"server error"})
   }
}


export const login = async (req,res)=>{
    const {email , password}=req.body;

    try {
        
        const user = await userModel.findOne({email})
    
        if(!user){
            return res.status(401).json({
                success:false,
                message:"email or password is incorrect"
            })
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"email or password is incorrect"
            })
        }
        await sendToken(user,res,"user login successfully")
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"server error"})
    }
}

export const getMe = async(req,res)=>{
    const user = req.user

    try {
        res.status(200).json({
            message:"user fatch successfully",
            user:{
                id:user.id,
                email:user.email,
                fullname:user.fullname,
                contact:user.contact,
                role:user.role
            },
            success:true

        })
    } catch (error) {
        console.log("something went wrong",error)
    }
}