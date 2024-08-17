import { Request, Response } from "express";
import Prisma from "../database/prisma.js";
import BCryptJs from 'bcryptjs'
import generateToken from "../utils/generateToken.js";

export const SignUp = async (request: Request, response: Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = request.body

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return response.status(400).json({ error: "Please fill in all fields" })
        }

        if (password !== confirmPassword) {
            return response.status(400).json({ error: "Passwords don't match" })
        }

        const user = await Prisma.user.findUnique({ where: { username } })

        if (user) {
            return response.status(400).json({ error: "Username already exists" })
        }

        const salt = await BCryptJs.genSalt(10)
        const hashedPassword = await BCryptJs.hash(password, salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await Prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        })

        if (newUser) {
            generateToken(newUser.id, response)

            response.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        }
        else {
            response.status(400).json({ error: "Invalid user data" })
        }

    } catch (error: any) {
        console.log("Error in signup controller", error.message)
        response.status(500).json({ error: "Internal Server Error" })
    }
}

export const LogIn = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body
        const user = await Prisma.user.findUnique({ where: { username } })
        if (!user) {
            return response.status(400).json({ error: "Invalid credentials" })
        }
        const isPasswordCorrect = await BCryptJs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return response.status(400).json({ error: "Invalid credentials" })
        }
        generateToken(user.id, response)
        response.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    }
    catch (error: any) {
        console.log("Error in login controller", error.message)
        response.status(500).json({ error: "Internal Server Error" })
    }
}

export const LogOut = async (request: Request, response: Response) => {
    try {
        response.cookie("jwt", "", { maxAge: 0 })
        response.status(200).json({ message: "Logged out successfully" })
    }
    catch (error: any) {
        console.log("Error in logout controller", error.message)
        response.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMe = async (request: Request, response: Response) => {
    try {
        const user = await Prisma.user.findUnique({ where: { id: request.user.id } })
        if (!user) {
            return response.status(404).json({ error: "User not found" })
        }
        response.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    }
    catch (error: any) {
        console.log("Error in getMe controller", error.message)
        response.status(500).json({ error: "Internal Server Error" })
    }
}