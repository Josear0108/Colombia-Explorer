import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CountUp from '../ui/CountUp'

interface HeroSectionProps {
  onSearch?: (query: string) => void
  totalAttractions?: number
  totalFestivals?: number
  totalDishes?: number
}

export default function HeroSection({ onSearch, totalAttractions, totalFestivals, totalDishes }: HeroSectionProps) {
  const [query, setQuery] = useState('')
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <section className="relative overflow-hidden
      mx-4 mt-4 rounded-3xl
      md:mx-0 md:mt-0 md:rounded-none
      lg:rounded-2xl"
    >
      {/* ── Backgrounds ─────────────────────────────────── */}
      {/* Gradiente: Azul Colombia profundo → Verde selva tropical */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003A75] via-[#0052A5] to-[#1A5C30]" />

      {/* Acento dorado bandera — visible y soberano */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_60%_at_78%_12%,rgba(252,209,22,0.38)_0%,transparent_68%)]" />

      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.05]" />
      <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-selva/15" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-gold/[0.07] hidden lg:block" />

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative
        px-6 py-10
        md:py-20 md:flex md:flex-col md:items-center md:text-center
        lg:py-28"
      >
        <div className="flex items-center gap-1.5 text-white/70 text-[11px] mb-4 md:justify-center tracking-widest uppercase font-bold">
          <MapPin size={11} />
          <span>{t('hero.location')}</span>
        </div>

        <h1
          className="text-white leading-[1.1] mb-3
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          {t('hero.title')}{' '}
          <span className="text-gold italic">{t('hero.titleHighlight')}</span>
        </h1>

        <p className="text-white/75 mb-8 max-w-sm md:max-w-md text-sm md:text-base leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-white rounded-2xl p-3 shadow-2xl w-full md:max-w-lg"
        >
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={t('hero.searchPlaceholder')}
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
        </form>

        {/* Stats */}
        <div className="flex items-center justify-center mt-8">
          {[
            { to: totalAttractions ?? 41, label: t('hero.stats.destinations') },
            { to: totalFestivals ?? 160, label: t('hero.stats.festivals') },
            { to: totalDishes ?? 68, label: t('hero.stats.dishes') },
          ].map(({ to, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && <span className="w-px h-9 bg-white/25 mx-4 md:mx-8 shrink-0" />}
              <div className="text-center">
                <div
                  className="text-white font-black text-xl md:text-3xl leading-none tabular-nums"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  <CountUp to={to} />+
                </div>
                <div className="text-white/60 text-[9px] md:text-[10px] mt-1 tracking-widest uppercase font-bold whitespace-nowrap">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
