import type { ReactNode } from 'react'
import type { BadgeVariant } from '../../types'

const variants: Record<BadgeVariant, string> = {
  primary: 'bg-sky-100 text-sky-700',
  yellow:  'bg-yellow-100 text-yellow-700',
  green:   'bg-green-100 text-green-700',
  red:     'bg-red-100 text-red-600',
  gray:    'bg-gray-100 text-gray-600',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-semibold
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}
