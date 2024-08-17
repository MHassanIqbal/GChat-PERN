import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

type SignUpInputs = {
    fullName: string
    username: string
    password: string
    confirmPassword: string
    gender: string
}

const UseSignUp = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const signUp = async (inputs: SignUpInputs) => {
        try {
            setLoading(true)
            const response = await fetch('api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
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

    return { loading, signUp }
}

export default UseSignUp