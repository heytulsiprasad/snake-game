import React, { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: ReactNode
}

export const Button: React.FC<ButtonProps & HTMLMotionProps<'button'>> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 transform active:scale-95'
  
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-800',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-800',
  }

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}