import express from 'express';
import ProtectRoute from '../middleware/ProtectRoute.js';
import { getMessage, sendMessage, getUsersForSidebar } from '../controller/messageController.js';
const MessageRouter = express.Router();
MessageRouter.get("/conversations", ProtectRoute, getUsersForSidebar);
MessageRouter.get('/:id', ProtectRoute, getMessage);
MessageRouter.post('/send/:id', ProtectRoute, sendMessage);
export default MessageRouter;
