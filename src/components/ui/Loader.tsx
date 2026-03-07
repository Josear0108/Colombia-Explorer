import { useTranslation } from 'react-i18next'

interface LoaderProps {
  /** Full-page overlay; otherwise inline block */
  fullPage?: boolean
  /** Optional label below the spinner */
  label?: string
  /** Size: sm, md, lg */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-2',
  lg: 'w-14 h-14 border-[3px]',
}

export default function Loader({
  fullPage = false,
  label,
  size = 'md',
  className = '',
}: LoaderProps) {
  const { t } = useTranslation()

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-label={label ?? t('common.loading')}
    >
      <div
        className={`
          rounded-full border-primary border-t-transparent animate-spin
          ${sizeClasses[size]}
        `}
      />
      {label && (
        <span className="text-sm font-medium text-gray-500">{label}</span>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
