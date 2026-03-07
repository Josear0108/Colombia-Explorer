import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import HeroSection from '../components/features/HeroSection'
import CategoryList from '../components/features/CategoryList'
import LocationCard from '../components/features/LocationCard'
import CardSkeleton from '../components/ui/CardSkeleton'
import { useLocations } from '../hooks/useLocations'
import { useHeroStats } from '../hooks/useHeroStats'
import { filterLocations } from '../utils/categoryFilter'

const HOME_LIMIT = 6

export default function Home() {
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslation()
  const { locations, loading, error } = useLocations()
  const heroStats = useHeroStats()

  const filtered = useMemo(
    () => filterLocations(locations, category, searchQuery),
    [locations, category, searchQuery],
  )

  return (
    <div className="pb-12">
      <HeroSection
        onSearch={setSearchQuery}
        totalAttractions={heroStats.attractions}
        totalFestivals={heroStats.festivals}
        totalDishes={heroStats.dishes}
      />

      <div className="max-w-7xl mx-auto">
        <CategoryList onSelect={setCategory} />

        <div className="px-4 sm:px-6 lg:px-8 mt-8 md:mt-10">
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
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filtered.slice(0, HOME_LIMIT).map((location, i) => (
                  <LocationCard key={location.id} location={location} index={i} />
                ))}
              </div>

              {filtered.length > HOME_LIMIT && (
                <div className="mt-10 flex justify-center">
                  <Link
                    to="/destinations"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-light active:scale-95 transition-all"
                  >
                    {t('home.viewMore', { count: filtered.length - HOME_LIMIT })}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </>
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
