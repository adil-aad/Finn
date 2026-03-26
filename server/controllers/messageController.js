// ai chat controller

import Chat from "../models/Chat.js"
import User from "../models/User.js"

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.params

        const chat = await Chat.findOne({ userId, _id: chatId })

        if(!chat){
            return res.status(404).json({success:false, message: "Chat not found"})
        }

        return res.json({success:true, messages: chat.messages})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "User", content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
            model: "gemini-3.1-flash-lite-preview", // Use the Gemini model name here
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage:false}

        res.json({success:true, reply})

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -1}})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Image generation controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        if(req.user.credits < 2){
            return res.json({success:false, message:"Not enough credits for image generation"})
        }

        const {prompt, chatId, isPublished} = req.body

        const chat = await Chat.findOne({userId, _id:chatId})

        chat.messages.push({
            role: "User", content: prompt, timestamp: Date.now(), isImage: false
        })
    } catch (error) {
        
    }
}
