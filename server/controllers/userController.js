// api to register user

import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Chat from "../models/Chat.js"

//generate JWT

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const formatUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits
})


export const registerUser = async (req,res) => {
    const {name, email, password} = req.body

    try {
       if(!name || !email || !password){
        return res.status(400).json({success:false, message: "Name, email and password are required"})
       }

       const userExists = await User.findOne({email})

       if(userExists){
        return res.status(409).json({success:false, message: "User already exists"})
       }
       const user = await User.create({name, email, password})

       const token = generateToken(user._id)
       res.status(201).json({success:true, token, user: formatUser(user)})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}


// api to Login user

export const loginUser = async (req,res) => {
    const {email, password} = req.body

    try {
       if(!email || !password){
        return res.status(400).json({success:false, message:"Email and password are required"})
       }

       const user = await User.findOne({email})
       if(!user){
        return res.status(401).json({success:false, message:"Invalid Email or Password"})
       }

       const isMatch = await bcrypt.compare(password, user.password)

       if(isMatch){
        const token = generateToken(user._id)
        return res.json({success:true, token, user: formatUser(user)})
       }
       return res.status(401).json({success:false, message:"Invalid Email or Password"})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}

export const getUser = async (req,res)=>{
    try {
        const user = req.user
        return res.json({success:true, user: formatUser(user)})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id
        const { name, email, password } = req.body

        if(!name && !email && !password){
            return res.status(400).json({success:false, message: "At least one field is required"})
        }

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({success:false, message: "User not found"})
        }

        if(email && email !== user.email){
            const existingUser = await User.findOne({ email })

            if(existingUser){
                return res.status(400).json({success:false, message: "Email already in use"})
            }

            user.email = email
        }

        if(name){
            user.name = name
        }

        if(password){
            user.password = password
        }

        await user.save()

        return res.json({
            success:true,
            message: "User updated successfully",
            user: formatUser(user)
        })
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}


// API to get published Images

export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            {$unwind: "$messages"},
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
            
        ])

        res.json({success:true, images: publishedImageMessages.reverse})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}