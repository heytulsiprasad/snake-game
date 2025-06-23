import React, { useState } from 'react'
import { Modal } from '../UI/Modal'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { useAuth } from '../../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password)
    onClose()
  }

  const handleSignup = async (email: string, password: string, username: string) => {
    await signUp(email, password, username)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLogin ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </Modal>
  )
}