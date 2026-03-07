import { useState, useEffect } from 'react'
import { unsplashApi } from '../services/unsplashApi'
import type { UnsplashPhoto } from '../types/unsplash'

/**
 * Busca fotos en Unsplash para el término dado (nombre de atracción + Colombia).
 * Retorna vacío mientras `query` sea undefined.
 */
export function useUnsplashPhotos(query: string | undefined, perPage = 12) {
    const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query) return
        let cancelled = false
        setLoading(true)
        setError(null)

        unsplashApi.searchPhotos(query, 1, perPage)
            .then((res) => {
                if (!cancelled) setPhotos(res.results ?? [])
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Error cargando fotos')
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => { cancelled = true }
    }, [query, perPage])

    return { photos, loading, error }
}
