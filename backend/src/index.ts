import express from 'express'
import authRoutes from './routes/authRoute.js'
import messageRoutes from './routes/messageRoute.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()

dotenv.config()

const PORT = process.env.PORT || 8000

app.use(cookieParser()) //for parsing cookies
app.use(express.json()) //for parsing express applicaion/json

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT)
});
