import express from 'express'
import { getUser, loginUser, registerUser, updateUser } from '../controllers/userController.js'
import { protect } from '../middlewares/auth.js'

const userRouter = express.Router()


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data',protect, getUser)
userRouter.put('/update', protect, updateUser)


export default userRouter
