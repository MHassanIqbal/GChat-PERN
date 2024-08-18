import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const UseGetConversations = () => {
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState<ConversationType[]>([])

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/messages/conversations')
                const data = await response.json()
                if (data.error) { throw new Error(data.error) }
                setConversations(data)
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getConversations()
    }, [])

    return { loading, conversations }
}

export default UseGetConversations