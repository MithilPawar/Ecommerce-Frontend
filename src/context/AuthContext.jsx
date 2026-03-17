import { createContext, useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const login = useCallback(async (credentials) => {
    const data = await apiLogin(credentials)
    const normalizedUser = {
      name: data.name || null,
      email: data.email || credentials.email,
      role: data.role || null,
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setToken(data.token)
    setUser(normalizedUser)
    return data
  }, [])

  const register = useCallback(async (credentials) => {
    const data = await apiRegister(credentials)
    const normalizedUser = {
      name: data.name || credentials.name || null,
      email: data.email || credentials.email,
      role: data.role || null,
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setToken(data.token)
    setUser(normalizedUser)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const openAuthModal  = useCallback(() => setAuthModalOpen(true),  [])
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  return (
    <AuthContext.Provider value={{
      token, user, isLoggedIn: !!token,
      isAdmin: user?.role === 'ADMIN',
      login, register, logout,
      authModalOpen, openAuthModal, closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
