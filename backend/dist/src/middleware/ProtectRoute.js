import jwt from 'jsonwebtoken';
import Prisma from '../database/prisma.js';
const ProtectRoute = async (request, response, nextFunction) => {
    try {
        const token = request.cookies.jwt;
        if (!token) {
            return response.status(401).json({ error: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return response.status(401).json({ error: "Unauthorized - Invalid Token" });
        }
        const user = await Prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        });
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        request.user = user;
        nextFunction();
    }
    catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        response.status(500).json({ error: "Internal Server Error" });
    }
};
export default ProtectRoute;
