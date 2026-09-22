import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-3">
      <p className="text-6xl font-black text-primary/20">404</p>
      <h1 className="text-xl font-bold text-gray-900">{t('notFound.title')}</h1>
      <p className="text-sm text-gray-500 max-w-sm">{t('notFound.hint')}</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-light active:scale-95 transition-all"
      >
        {t('notFound.cta')}
      </Link>
    </div>
  )
}
