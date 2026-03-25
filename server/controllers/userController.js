// api to register user

import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

//generate JWT

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


export const registerUser = async (req,res) => {
    const {name, email, password} = req.body

    try {
       const userExists = await User.findOne({email})

       if(userExists){
        return res.json({success:true, message: "User already exists"})
       }
       const user = await User.create({name, email, password})

       const token = generateToken(user._id)
       res.json({success:true, token})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}


// api to Login user

export const loginUser = async (req,res) => {
    const {email, password} = req.body

    try {
       const user = await User.findOne({email})
       if(!user){
        return res.json({success:false, message:"Invalid Email or Password"})
       }

       const isMatch = await bcrypt.compare(password, user.password)

       if(isMatch){
        const token = generateToken(user._id)
        return res.json({success:true, token})
       }
       return res.json({success:false, message:"Invalid Email or Password"})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

export const getUser = async (req,res)=>{
    try {
        const user = req.user
        return res.json({success:true, user})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id
        const { name, email, password } = req.body

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
            user
        })
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}
