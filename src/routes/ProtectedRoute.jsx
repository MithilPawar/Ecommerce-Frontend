import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin, openAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      // Remember where the user was trying to go
      sessionStorage.setItem('postLoginRedirect', window.location.pathname)
      openAuthModal()
      navigate('/', { replace: true })
      return
    }

    if (requireAdmin && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, isAdmin, requireAdmin, openAuthModal, navigate])

  if (!isLoggedIn) return null
  if (requireAdmin && !isAdmin) return null
  return children
}
