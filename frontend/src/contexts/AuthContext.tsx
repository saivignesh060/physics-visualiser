import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock login - in production, this would call your backend API
        // For demo purposes, accept any email/password combination
        if (email && password) {
            const mockUser: User = {
                id: '1',
                name: email.split('@')[0],
                email: email
            }
            setUser(mockUser)
            localStorage.setItem('user', JSON.stringify(mockUser))
            return true
        }
        return false
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // Mock registration - in production, this would call your backend API
        if (name && email && password) {
            const mockUser: User = {
                id: Date.now().toString(),
                name: name,
                email: email
            }
            setUser(mockUser)
            localStorage.setItem('user', JSON.stringify(mockUser))
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
