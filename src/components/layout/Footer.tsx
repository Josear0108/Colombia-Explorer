import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS as NAV_LINKS } from '../../config/navigation'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Brand + navigation (mobile only, desktop header already shows it) */}
        <div className="flex flex-col gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <img src="/logo-colombia-explorer.png" alt="" className="w-8 h-8 object-contain shrink-0" />
              <span className="text-base font-black tracking-widest text-gray-900 uppercase">
                Colombia Explorer
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation — only on mobile since desktop header already shows it */}
          <div className="md:hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              {t('footer.nav')}
            </h3>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ to, key }) => (
                <li key={key}>
                  <Link
                    to={to}
                    className="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>{t('footer.copyright', { year })}</span>
          <span>
            Made with <span className="text-red-400">♥</span> for Colombia
          </span>
        </div>

      </div>
    </footer>
  )
}
