import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type AuthUserType = {
    id: string
    fullName: string
    email: string
    profilePic: string
    gender: string
}

const AuthContext = createContext<{
    authUser: AuthUserType | null
    setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>
    isLoading: boolean
}>({
    authUser: null,
    setAuthUser: () => { },
    isLoading: true
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<AuthUserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                const response = await fetch('/api/auth/me')
                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data.error)
                }
                setAuthUser(data)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAuthUser()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                authUser,
                isLoading,
                setAuthUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}