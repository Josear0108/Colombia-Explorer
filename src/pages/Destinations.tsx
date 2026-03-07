import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import CategoryList from '../components/features/CategoryList'
import LocationCard from '../components/features/LocationCard'
import CardSkeleton from '../components/ui/CardSkeleton'
import { useLocations } from '../hooks/useLocations'
import { filterLocations } from '../utils/categoryFilter'

export default function Destinations() {
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslation()
  const { locations, loading, error } = useLocations()

  const filtered = useMemo(
    () => filterLocations(locations, category, searchQuery),
    [locations, category, searchQuery],
  )

  return (
    <div className="pb-12">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#003A75] to-[#0052A5] border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-gold text-[11px] font-bold tracking-widest uppercase mb-1">
            🇨🇴 {t('locationDetail.colombia')}
          </p>
          <h1
            className="text-white font-black text-2xl md:text-4xl leading-tight"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            {t('home.popularDestinations')}
          </h1>
          <p className="text-white/65 text-sm mt-1.5 max-w-md">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full sm:max-w-md border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary transition-colors"
          />
        </div>

        <CategoryList onSelect={setCategory} />

        <div className="mt-8 md:mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 md:text-xl">
              {t('home.popularDestinations')}
            </h2>
            {!loading && (
              <span className="text-xs font-semibold text-primary">
                {t('home.place', { count: filtered.length })}
              </span>
            )}
          </div>

          {error && (
            <div className="text-center py-20 text-red-400">
              <p className="font-semibold text-base">{t('home.error')}</p>
              <p className="text-sm mt-1 text-gray-400">{error}</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((location, i) => (
                <LocationCard key={location.id} location={location} index={i} />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="font-semibold text-base">{t('home.noDestinations')}</p>
              <p className="text-sm mt-1">{t('home.noDestinationsHint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
