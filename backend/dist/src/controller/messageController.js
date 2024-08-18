import Prisma from "../database/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (request, response) => {
    try {
        const { message } = request.body;
        const { id: receiverId } = request.params;
        const senderId = request.user.id;
        let conversation = await Prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        // the very first message is being sent, that's why we need to create a new conversation
        if (!conversation) {
            conversation = await Prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        const newMessage = await Prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await Prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        // Socket io
        const receivedSocketId = getReceiverSocketId(receiverId);
        if (receivedSocketId) {
            io.to(receivedSocketId).emit('newMessage', newMessage);
        }
        response.json(201).json(sendMessage);
    }
    catch (error) {
        console.error("Error in sendMessage: ", error.message);
        response.status(500).json({ error: "Internal server error" });
    }
};
export const getMessage = async (request, response) => {
    try {
        const { id: userToChatId } = request.params;
        const senderId = request.user.id;
        const conversation = await Prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return response.status(200).json([]);
        }
        response.status(200).json(conversation.messages);
    }
    catch (error) {
        console.error("Error in getMessages: ", error.message);
        response.status(500).json({ error: "Internal server error" });
    }
};
export const getUsersForSidebar = async (request, response) => {
    try {
        const authUserId = request.user.id;
        const users = await Prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        response.status(200).json(users);
    }
    catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        response.status(500).json({ error: "Internal server error" });
    }
};
