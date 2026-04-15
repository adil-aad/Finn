// ai chat controller

import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openai.js"

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

         //check credits

        if(req.user.credits < 1){
            return res.json({success:false, message:"Not enough credits for text generation"})
        }
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})

        if(!chat){
            return res.json({success:false, message: "Chat not found"})
        }

        chat.messages.push({role: "User", content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
            model: "gemini-2.5-flash", 
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage:false}

        res.json({success:true, reply})

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -1}})
        
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

// Image generation controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        //check credits

        if(req.user.credits < 2){
            return res.json({success:false, message:"Not enough credits for image generation"})
        }

        const {prompt, chatId, isPublished} = req.body

        const chat = await Chat.findOne({userId, _id:chatId})

        if(!chat){
            return res.status(404).json({success:false, message: "Chat not found"})
        }

        chat.messages.push({
            role: "User",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        // encode the prompt 

        const encodedPrompt = encodeURIComponent(prompt)

        // construct ImageKit generation URL

        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/Finn/${Date.now()}.png?tr=w=800,h=800`

        // Generating and fetching from imagekit

        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

        // conver to base_64

        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`

        //upload to imageKit media library 

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'Finn'
        })

        const reply = {role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(), 
            isImage:true,
            isPublished
        }

        res.json({success:true, reply})

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -2}})


    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
