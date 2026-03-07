import { useState } from 'react'
import { Bell, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../ui/LanguageSwitcher'

interface NavItem {
  to: string
  key: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'nav.home' },
  { to: '/destinations', key: 'nav.destinations' },
  { to: '/', key: 'nav.experiences' },
  { to: '/', key: 'nav.about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <img src="/logo-colombia-explorer.png" alt="" className="w-8 h-8 object-contain shrink-0" />
          {/* Text hidden on small screens to prevent overflow */}
          <span className="hidden sm:block text-base font-black tracking-widest text-gray-900 uppercase truncate">
            Colombia Explorer
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, key }) => (
            <NavLink
              key={key}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />

          {/* Bell + Avatar — desktop only */}
          <button
            aria-label={t('aria.notifications')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:flex"
          >
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
          </button>

          <button
            aria-label={t('aria.userProfile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark items-center justify-center text-white font-bold text-sm shadow-sm hidden md:flex"
          >
            U
          </button>

          {/* Hamburger — mobile only */}
          <button
            aria-label={t('aria.toggleNav')}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {menuOpen
              ? <X size={20} className="text-gray-700" />
              : <Menu size={20} className="text-gray-700" />
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
          {NAV_ITEMS.map(({ to, key }) => (
            <NavLink
              key={key}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}

          {/* Bell + Avatar in drawer on mobile */}
          <div className="flex items-center gap-3 px-4 pt-3 mt-1 border-t border-gray-100">
            <button
              aria-label={t('aria.notifications')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            </button>
            <button
              aria-label={t('aria.userProfile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-sm"
            >
              U
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
