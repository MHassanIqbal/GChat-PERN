import express from 'express'

const MessageApp = express()

MessageApp.get("/coversation", (request, response) => {
    response.send("Messages")
})

export default MessageApp