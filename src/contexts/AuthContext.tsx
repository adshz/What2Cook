import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebase/firebase'

const AuthContext = createContext<{
    currentUser: User | null
    userLoggedIn: boolean
    loading: boolean
}>({
    currentUser: null,
    userLoggedIn: false,
    loading: true,
})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
    }, [])

    async function initializeUser(user: User | null) {
        if (user) {
            setCurrentUser({ ...user })
            setUserLoggedIn(true)
        } else {
            setCurrentUser(null)
            setUserLoggedIn(false)
        }
        setLoading(false)
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
