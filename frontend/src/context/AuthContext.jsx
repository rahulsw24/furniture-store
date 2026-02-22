import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    /* ---------- Load session on app start ---------- */

    useEffect(() => {
        async function init() {
            const me = await authApi.getMe()
            setUser(me)
            setLoading(false)
        }

        init()
    }, [])

    /* ---------- Actions ---------- */

    const login = async (email, password) => {
        const user = await authApi.login(email, password);
        setUser(user); // 'user' is already the object, no need for .user
        return user;   // Return the user so the UI sees 'success'
    }

    const refreshUser = async () => {
        const res = await fetch(`${API_URL}/api/users/me`, {
            credentials: "include",
        })

        const data = await res.json()
        setUser(data.user)
    }


    const signup = async formData => {
        const user = await authApi.signup(formData);
        setUser(user);
        return user;   // Return the user so the UI sees 'success'
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, signup, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)