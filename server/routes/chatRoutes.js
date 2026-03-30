import express from "express"
import { createChat, deleteChat, getChat, getChats, renameChat } from "../controllers/chatController.js"
import { getMessages } from "../controllers/messageController.js"
import { protect } from "../middlewares/auth.js"

const chatRouter = express.Router()


chatRouter.get('/create',protect, createChat)
chatRouter.get('/get',protect, getChats)
chatRouter.get('/:chatId/messages',protect, getMessages)
chatRouter.put('/:chatId',protect, renameChat)
chatRouter.get('/:chatId',protect, getChat)
chatRouter.post('/delete',protect, deleteChat)


export default chatRouter
