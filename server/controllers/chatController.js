// Api controller for creating a new chat

import Chat from "../models/Chat.js"
import mongoose from "mongoose"

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chatData = {
            userId, 
            messages: [],
            name: "New Chat",
            userName: req.user.name

        }

        await Chat.create(chatData)
        res.json({success:true, message: "Chat created"})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}


// Getting all chats


export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({userId}).sort({updatedAt: -1})
        
        res.json({success:true, chats})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}


// Getting a single chat
export const getChat = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.params

        const chat = await Chat.findOne({ _id: chatId, userId })

        if(!chat){
            return res.status(404).json({success:false, message: "Chat not found"})
        }

        res.json({success:true, chat})
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
}


// Rename chat
export const renameChat = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.params
        const { name } = req.body

        if(!mongoose.Types.ObjectId.isValid(chatId)){
            return res.status(400).json({success:false, message: "Invalid chat id"})
        }

        if(!name || !name.trim()){
            return res.status(400).json({success:false, message: "Chat name is required"})
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: chatId, userId },
            { name: name.trim() },
            { new: true }
        )

        if(!chat){
            return res.status(404).json({success:false, message: "Chat not found"})
        }

        return res.json({success:true, message: "Chat renamed", chat})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}


//delete chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId} = req.body

        await Chat.deleteOne({_id: chatId, userId})
        
        res.json({success:true, message: "Chat Deleted"})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
