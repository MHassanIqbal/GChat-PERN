import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

const UseLogin = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const login = async (username: string, password: string) => {
        try {
            setLoading(true)
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)
            setAuthUser(data)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, login }
}

export default UseLogin