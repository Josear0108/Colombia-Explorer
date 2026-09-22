import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import HeroSection from '../components/features/HeroSection'
import CategoryList from '../components/features/CategoryList'
import LocationResults from '../components/features/LocationResults'
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
          <LocationResults
            title={t('home.popularDestinations')}
            locations={filtered.slice(0, HOME_LIMIT)}
            resultsCount={filtered.length}
            loading={loading}
            error={error}
            skeletonCount={6}
            footer={filtered.length > HOME_LIMIT && (
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
          />
        </div>
      </div>
    </div>
  )
}
