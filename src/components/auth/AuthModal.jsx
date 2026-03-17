import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Modal from '../common/Modal'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth()
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  function handleSuccess() {
    closeAuthModal()
    setMode('login')
    // Redirect to the page the user was trying to visit before login
    const redirect = sessionStorage.getItem('postLoginRedirect')
    if (redirect) {
      sessionStorage.removeItem('postLoginRedirect')
      navigate(redirect)
    }
  }

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      title={mode === 'login' ? 'Sign in to your account' : 'Create an account'}
    >
      {mode === 'login' ? (
        <LoginForm onSuccess={handleSuccess} switchToRegister={() => setMode('register')} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} switchToLogin={() => setMode('login')} />
      )}
    </Modal>
  )
}
