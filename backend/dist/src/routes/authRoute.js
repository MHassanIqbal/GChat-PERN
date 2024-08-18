import express from 'express';
import { getMe, LogIn, LogOut, SignUp } from '../controller/authController.js';
import ProtectRoute from '../middleware/ProtectRoute.js';
const AuthRouter = express.Router();
AuthRouter.get("/me", ProtectRoute, getMe);
AuthRouter.post("/signup", SignUp);
AuthRouter.post("/login", LogIn);
AuthRouter.post("/logout", LogOut);
export default AuthRouter;
