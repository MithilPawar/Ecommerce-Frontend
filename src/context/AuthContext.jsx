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
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ email: data.email }))
    setToken(data.token)
    setUser({ email: data.email })
    return data
  }, [])

  const register = useCallback(async (credentials) => {
    const data = await apiRegister(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ email: data.email }))
    setToken(data.token)
    setUser({ email: data.email })
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
      login, register, logout,
      authModalOpen, openAuthModal, closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
