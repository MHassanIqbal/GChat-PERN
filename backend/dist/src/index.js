import express from 'express';
import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket.js';
import path from 'path';
dotenv.config();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();
app.use(cookieParser()); //for parsing cookies
app.use(express.json()); //for parsing express applicaion/json
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
if (process.env.NODE_ENV !== "development") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}
server.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT);
});
