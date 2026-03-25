import express from "express"
import { createChat, deleteChat, getChat, getChats } from "../controllers/chatController.js"
import { protect } from "../middlewares/auth.js"

const chatRouter = express.Router()


chatRouter.get('/create',protect, createChat)
chatRouter.get('/get',protect, getChats)
chatRouter.get('/:chatId',protect, getChat)
chatRouter.post('/delete',protect, deleteChat)


export default chatRouter
