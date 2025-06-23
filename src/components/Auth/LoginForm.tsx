import React, { type FC } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader } from 'lucide-react'
import { Button } from '../UI/Button'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  onSwitchToSignup: () => void
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>

      {error && (
        <motion.div
          className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input pl-10"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input pl-10"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin w-5 h-5 mr-2" />
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </Button>

      <p className="text-center text-gray-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-green-500 hover:text-green-400 font-semibold"
        >
          Sign up
        </button>
      </p>
    </motion.form>
  )
}