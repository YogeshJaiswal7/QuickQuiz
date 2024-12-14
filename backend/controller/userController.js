import {User}  from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res) =>{
    try {
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !password || !phoneNumber || !role){
            return res.status(400).json({
                message: "Please fill all fields",
                suceess:"false"
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "email already exists",
                success : false
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        });
        return res.status(201).json({
            message: "User created successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const login = async(req,res)=>{
    try {
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message: "Please fill all fields",
                success : false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password",
                success : false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect Password",
                success : false
            })
        }
        if(role !== user.role){
            return res.status(400).json({
                message: "Account does not exist with current role",
                success : false
            })
        }
        const tokenData = {
            userId : user._id
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn :'1d'})
        user = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            role : user.role,
            phoneNumber : user.phoneNumber
        }
        return res.status(200).cookie("token",token,{maxAge :1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async(req,res)=>{
   try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message :"logout successfully",
            success : true
        })
   } catch (error) {
        console.log(error);
   } 
}

export const getAllStudent = async(req,res)=>{
    try {
        const students = await User.find({role :'student'}).select('name');
        
        if(!students || students.length === 0){
            return res.status(404).json({
                message : "No student found",
                success : false
            })
        }
        return res.status(200).json({
            students,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}