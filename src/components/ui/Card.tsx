import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  onClick?: () => void
}

export default function Card({ children, className = '', onClick, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 overflow-hidden
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200' : 'shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
