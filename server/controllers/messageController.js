// ai chat controller

import Chat from "../models/Chat.js"


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "Uesr", content: prompt, timestamp: Date.now(), isImage: false})
    } catch (error) {
        
    }
}