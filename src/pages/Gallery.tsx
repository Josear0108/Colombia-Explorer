import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation } from '../hooks/useLocations'
import { useUnsplashPhotos } from '../hooks/useUnsplashPhotos'
import { useAppStore } from '../store/useAppStore'
import { unsplashApi } from '../services/unsplashApi'
import type { UnsplashPhoto } from '../types/unsplash'

// Indices que ocupan 2 columnas para dar variedad visual al grid
const WIDE_INDICES = new Set([0, 6, 11])

interface PhotoCardProps {
  photo: UnsplashPhoto
  locationName: string
  index: number
}

function PhotoCard({ photo, locationName, index }: PhotoCardProps) {
  const { t } = useTranslation()
  const isWide = WIDE_INDICES.has(index)

  const handleDownload = async () => {
    try {
      await unsplashApi.trackDownload(photo.downloadLocation)
    } catch {
      // silencioso — el tracking no bloquea la descarga
    }
    window.open(photo.urls.full, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={[
        'relative rounded-2xl overflow-hidden group bg-gray-100',
        isWide
          ? 'col-span-2 h-52 sm:h-56 lg:h-64'
          : 'h-36 sm:h-40 lg:h-48',
      ].join(' ')}
    >
      <img
        src={photo.urls.regular}
        alt={photo.description ?? locationName}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />

      {/* Botones de acción */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <a
          href={photo.unsplashUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver en Unsplash"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <ExternalLink size={14} className="text-gray-700" />
        </a>
        <button
          aria-label={t('aria.download')}
          onClick={handleDownload}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Download size={14} className="text-gray-700" />
        </button>
      </div>

      {/* Atribución al fotógrafo (requerida por ToS de Unsplash) */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <a
          href={photo.user.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-white/90 hover:text-white transition-colors"
        >
          {photo.user.name} · Unsplash
        </a>
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className={[
            'rounded-2xl bg-gray-200 animate-pulse',
            WIDE_INDICES.has(i)
              ? 'col-span-2 h-52 sm:h-56 lg:h-64'
              : 'h-36 sm:h-40 lg:h-48',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

export default function Gallery() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { location, loading: locationLoading } = useLocation(id)
  const cachedName = useAppStore((s) => s.locations.find((l) => l.id === id)?.name)
  const query = cachedName ?? location?.name
  const { photos, loading: photosLoading } = useUnsplashPhotos(query)

  const loading = locationLoading || photosLoading

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label={t('aria.goBack')}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">
              {locationLoading ? t('common.loading') : (location?.name ?? t('gallery.title'))}
            </h1>
            <p className="text-xs text-gray-400">{t('gallery.destination', { id })}</p>
          </div>
          {!loading && photos.length > 0 && (
            <span className="ml-auto text-xs font-semibold text-primary shrink-0">
              {t('gallery.photos', { count: photos.length })}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <SkeletonGrid />
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
            <p className="text-base font-semibold">{t('gallery.noPhotos')}</p>
            <p className="text-sm">{t('gallery.noPhotosHint')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {photos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  locationName={location?.name ?? ''}
                  index={i}
                />
              ))}
            </div>

            {/* Atribución global requerida por Unsplash ToS */}
            <p className="text-center text-xs text-gray-400 mt-6">
              {t('gallery.photosBy')}{' '}
              <a
                href="https://unsplash.com/?utm_source=colombia_explorer&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600"
              >
                Unsplash
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
