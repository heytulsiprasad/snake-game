import type { FC } from 'react'
import { useState } from 'react'
import { Modal } from '../UI/Modal'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { useAuth } from '../../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password)
    onClose()
  }

  const handleSignup = async (email: string, password: string, username: string) => {
    await signUp(email, password, username)
    onClose()
  }

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
    // Google OAuth will redirect, so we don't need to close the modal
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLogin ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
          onGoogleSignIn={handleGoogleSignIn}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </Modal>
  )
}