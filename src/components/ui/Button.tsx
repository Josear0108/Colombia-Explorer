import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { ButtonVariant, ButtonSize } from '../../types'

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-sm',
  secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary/5',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-4 py-2 text-base rounded-xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
