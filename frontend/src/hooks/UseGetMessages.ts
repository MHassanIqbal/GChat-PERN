import { useEffect, useState } from "react"
import UseConversation from "../zustand/UseConversation"
import toast from "react-hot-toast"

const UseGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const { messages, setMessages, selectedConversation } = UseConversation()

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation) return
            setLoading(true)
            setMessages([])
            try {
                const response = await fetch(`/api/messages/${selectedConversation.id}`)
                const data = await response.json()
                if (!response.ok) throw new Error(data.error || "An error occurred")
                setMessages(data)
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getMessages()
    }, [selectedConversation, setMessages])

    return { loading, messages }
}

export default UseGetMessages