import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Heart, Camera, Users, Globe, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import { useLocation } from '../hooks/useLocations'
import { useUnsplashPhotos } from '../hooks/useUnsplashPhotos'
import { useAppStore } from '../store/useAppStore'
import { UNSPLASH_ATTRIBUTION_URL } from '../constants/unsplash'

function formatCoords(lat?: string, lng?: string) {
  const latNum = parseFloat(lat ?? '')
  const lngNum = parseFloat(lng ?? '')
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return '—'
  return `${latNum.toFixed(2)}° / ${lngNum.toFixed(2)}°`
}

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { location, loading, error } = useLocation(id)
  const favouriteIds = useAppStore((s) => s.favouriteIds)
  const toggleFavourite = useAppStore((s) => s.toggleFavourite)
  // Read name from cache so Unsplash fetch starts in parallel with location fetch
  const cachedName = useAppStore((s) => s.locations.find((l) => l.id === id)?.name)
  const liked = id ? favouriteIds.has(id) : false

  const [heroImgError, setHeroImgError] = useState(false)
  const { photos: allUnsplashPhotos, loading: photosLoading, error: photosError } = useUnsplashPhotos(cachedName ?? location?.name, 12)
  const unsplashPhotos = allUnsplashPhotos.slice(0, 4)
  const primaryHeroImg = location?.images[0]
  const heroSrc = primaryHeroImg && !heroImgError
    ? primaryHeroImg
    : allUnsplashPhotos[0]?.urls?.regular ?? null

  if (loading) return <Loader fullPage size="lg" />

  if (error || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
        <p className="text-base font-semibold">{t('locationDetail.notFound')}</p>
      </div>
    )
  }

  const stats = [
    {
      Icon: Users,
      value: location.cityPopulation?.toLocaleString() ?? '—',
      label: t('locationDetail.cityPopulation'),
      iconClass: 'text-primary',
    },
    {
      Icon: Globe,
      value: location.citySurface ? `${location.citySurface.toLocaleString()} km²` : '—',
      label: t('locationDetail.cityArea'),
      iconClass: 'text-primary',
    },
    {
      Icon: MapPin,
      value: formatCoords(location.latitude, location.longitude),
      label: t('locationDetail.coordinates'),
      iconClass: 'text-primary',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-[420px] lg:h-[500px] bg-gradient-to-br from-[#003A75] via-[#0052A5] to-[#1A5C30]">
        {heroSrc && (
          <img
            src={heroSrc}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => {
              if (!heroImgError) setHeroImgError(true)
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/30" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            aria-label={t('aria.goBack')}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-800" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => id && toggleFavourite(id)}
              aria-label={liked ? t('aria.unlike') : t('aria.like')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
            >
              <Heart size={18} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'} />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <h1 className="text-white font-black mt-2 leading-snug text-2xl md:text-4xl lg:text-5xl">
            {location.name}
          </h1>
          {location.region && (
            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1.5">
              <MapPin size={13} />
              <span>{location.region}, {t('locationDetail.colombia')}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left / main column ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ Icon, value, label, iconClass }) => (
                <div key={label} className="bg-white rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 border border-gray-100">
                  <div className="flex items-center gap-1">
                    <Icon size={16} className={iconClass} />
                    <span className="text-sm md:text-base font-bold text-gray-900 truncate max-w-[80px] md:max-w-none">
                      {value}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* About */}
            {location.description && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-3 text-lg">{t('locationDetail.about')}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{location.description}</p>
              </div>
            )}
          </div>

          {/* ── Right / sidebar ────────────────────────────────────── */}
          <div className="space-y-5">

            {/* City info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3">{t('locationDetail.cityInfo')}</h2>
              <div className="space-y-2">
                {location.region && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('locationDetail.city')}</span>
                    <span className="font-semibold text-gray-800">{location.region}</span>
                  </div>
                )}
                {location.cityPopulation && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('locationDetail.cityPopulation')}</span>
                    <span className="font-semibold text-gray-800">{location.cityPopulation.toLocaleString()}</span>
                  </div>
                )}
                {location.citySurface && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('locationDetail.cityArea')}</span>
                    <span className="font-semibold text-gray-800">{location.citySurface.toLocaleString()} km²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery preview — fotos de Unsplash */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900">{t('locationDetail.photos')}</h2>
                <button
                  onClick={() => navigate(`/gallery/${id}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  <Camera size={13} />
                  {t('locationDetail.viewAll')}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {photosLoading
                  ? Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-xl bg-gray-200 animate-pulse ${i === 0 ? 'col-span-2 h-32' : 'h-20'}`}
                    />
                  ))
                  : photosError
                  ? (
                    <p className="col-span-2 text-xs text-gray-400 py-4 text-center">
                      {t('gallery.error')}
                    </p>
                  )
                  : unsplashPhotos.map((photo, i) => (
                    <div
                      key={photo.id}
                      onClick={() => navigate(`/gallery/${id}`)}
                      className={`rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${i === 0 ? 'col-span-2 h-32' : 'h-20'}`}
                    >
                      <img
                        src={photo.urls.small}
                        alt={photo.description ?? location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                }
              </div>

              {!photosLoading && !photosError && unsplashPhotos.length > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {t('locationDetail.photosBy')}{' '}
                  <a
                    href={UNSPLASH_ATTRIBUTION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Unsplash
                  </a>
                </p>
              )}
            </div>

            {/* CTA */}
            <Button className="w-full" size="lg" onClick={() => navigate(`/gallery/${id}`)}>
              {t('locationDetail.viewGallery')}
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
