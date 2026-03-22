// ai chat controller

import Chat from "../models/Chat.js"
import User from "../models/User.js"


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "User", content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
            model: "gemini-3-flash", // Use the Gemini model name here
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage:false}

        res.json({success:true, reply})

        chat.messages.push(reply)
        await Chat.save()

        await User.updateOne({_id: userId}, {$inc: {credites: -1}})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}