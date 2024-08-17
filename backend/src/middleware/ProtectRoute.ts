import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import Prisma from '../database/prisma.js'

interface DecodedToken extends JwtPayload {
    userId: string
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string
            }
        }
    }
}

const ProtectRoute = async (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        const token = request.cookies.jwt
        if (!token) {
            return response.status(401).json({ error: "Unauthorized - No token provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
        if (!decoded) {
            return response.status(401).json({ error: "Unauthorized - Invalid Token" })
        }
        const user = await Prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        })
        if (!user) {
            return response.status(404).json({ error: "User not found" })
        }
        request.user = user
        nextFunction()
    }
    catch (error: any) {
        console.log("Error in protectRoute middleware", error.message)
        response.status(500).json({ error: "Internal Server Error" })
    }
}

export default ProtectRoute