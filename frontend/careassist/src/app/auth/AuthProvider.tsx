import { createContext, useContext, useState, type ReactNode } from 'react'
import { authApi, type LoginPayload, type RegisterPayload, type User } from '../../services/api'

const AUTH_STORAGE_KEY = 'careassist.auth.user'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function persistUser(user: User | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())

  const login = async (payload: LoginPayload) => {
    const authenticatedUser = await authApi.login(payload)
    setUser(authenticatedUser)
    persistUser(authenticatedUser)
    return authenticatedUser
  }

  const register = async (payload: RegisterPayload) => {
    const registeredUser = await authApi.register(payload)
    setUser(registeredUser)
    persistUser(registeredUser)
    return registeredUser
  }

  const logout = () => {
    setUser(null)
    persistUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
