import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, openAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      // Remember where the user was trying to go
      sessionStorage.setItem('postLoginRedirect', window.location.pathname)
      openAuthModal()
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, openAuthModal, navigate])

  if (!isLoggedIn) return null
  return children
}
