import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import CategoryList from '../components/features/CategoryList'
import LocationResults from '../components/features/LocationResults'
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
          <LocationResults
            title={t('home.popularDestinations')}
            locations={filtered}
            loading={loading}
            error={error}
            skeletonCount={9}
          />
        </div>
      </div>
    </div>
  )
}
