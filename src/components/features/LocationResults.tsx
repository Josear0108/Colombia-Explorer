import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Location } from '../../types'
import LocationCard from './LocationCard'
import CardSkeleton from '../ui/CardSkeleton'

interface LocationResultsProps {
  title: string
  /** Ubicaciones a renderizar (ya recortadas por el caller si aplica, ej. límite en Home). */
  locations: Location[]
  /** Conteo mostrado en la etiqueta; por defecto `locations.length`. Home lo separa porque
   *  muestra el total filtrado aunque solo renderice un subconjunto (HOME_LIMIT). */
  resultsCount?: number
  loading: boolean
  error: string | null
  skeletonCount: number
  /** Slot opcional debajo de la grilla (ej. CTA "ver más" en Home). */
  footer?: ReactNode
}

export default function LocationResults({
  title,
  locations,
  resultsCount,
  loading,
  error,
  skeletonCount,
  footer,
}: LocationResultsProps) {
  const { t } = useTranslation()
  const count = resultsCount ?? locations.length

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 md:text-xl">{title}</h2>
        {!loading && (
          <span className="text-xs font-semibold text-primary">
            {t('home.place', { count })}
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
          {Array.from({ length: skeletonCount }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {!loading && !error && locations.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {locations.map((location, i) => (
              <LocationCard key={location.id} location={location} index={i} />
            ))}
          </div>
          {footer}
        </>
      )}

      {!loading && !error && locations.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="font-semibold text-base">{t('home.noDestinations')}</p>
          <p className="text-sm mt-1">{t('home.noDestinationsHint')}</p>
        </div>
      )}
    </>
  )
}
