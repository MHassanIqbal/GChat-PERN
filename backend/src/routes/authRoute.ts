import express from 'express'
import { getMeController, LogInController, LogOutController, SignUpController } from '../controller/authController.js'
import ProtectRoute from '../middleware/ProtectRoute.js'

const AuthRouter = express()

AuthRouter.post("/me", ProtectRoute, getMeController)
AuthRouter.post("/signup", SignUpController)
AuthRouter.post("/login", LogInController)
AuthRouter.post("/logout", LogOutController)

export default AuthRouter