import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, Camera } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import type { Location } from '../../types'
import { useAppStore } from '../../store/useAppStore'

interface LocationCardProps {
  location: Location
  index?: number
}

export default function LocationCard({ location, index = 0 }: LocationCardProps) {
  const [imgError, setImgError] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const favouriteIds = useAppStore((s) => s.favouriteIds)
  const toggleFavourite = useAppStore((s) => s.toggleFavourite)
  const liked = favouriteIds.has(location.id)

  const { id, name, region, images, description } = location
  const primaryImage = images[0]

  // Sin fallback a Unsplash por card: con hasta 50 cards por página, una búsqueda
  // por card agota la cuota horaria de Unsplash en una sola visita a /destinations.
  // Si no hay imagen de API Colombia, se muestra el gradiente placeholder de abajo.
  const displaySrc = primaryImage && !imgError ? primaryImage : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      onClick={() => navigate(`/location/${id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-shadow duration-200"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary to-selva overflow-hidden">
        {displaySrc && (
          <img
            src={displaySrc}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        <button
          aria-label={liked ? t('aria.removeFromFavourites') : t('aria.addToFavourites')}
          onClick={(e) => { e.stopPropagation(); toggleFavourite(location.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <Heart size={15} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-snug">{name}</h3>

        {region && (
          <div className="flex items-center gap-1 mt-1 text-gray-400">
            <MapPin size={12} />
            <span className="text-xs">{region}</span>
          </div>
        )}

        {description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-50">
          <button
            aria-label={t('aria.viewGallery')}
            onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${id}`) }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-light"
          >
            <Camera size={13} />
            {t('locationCard.gallery')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
