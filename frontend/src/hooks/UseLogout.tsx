import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const logout = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error)
            }

            setAuthUser(null)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, logout }
}
export default useLogout