import { useTranslation } from 'react-i18next'

const LANGS = ['es', 'en'] as const

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language.split('-')[0]

  return (
    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
            current === lang
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {t(`language.${lang}`)}
        </button>
      ))}
    </div>
  )
}
