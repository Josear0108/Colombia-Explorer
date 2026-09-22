/**
 * Cliente para la API de Unsplash (vía proxy `/api`).
 * Búsqueda de fotos y tracking de descargas.
 */
import { createApiClient } from './createClient'
import type { UnsplashPhoto, UnsplashSearchResponse } from '../types/unsplash'

const UNSPLASH_API = createApiClient('/api', 10_000)

const MAX_CACHE_ENTRIES = 50

/** Cache de resultados: clave = `query:page:perPage` */
const photoCache = new Map<string, UnsplashPhoto[]>()
/** Deduplicación de requests en vuelo (evita doble llamada de React StrictMode) */
const inflightRequests = new Map<string, Promise<UnsplashSearchResponse>>()

function cacheSet(key: string, photos: UnsplashPhoto[]) {
    // Cache acotada: sin límite, una sesión larga navegando muchos destinos
    // acumula entradas para siempre. Evicción FIFO simple (Map preserva orden de inserción).
    if (photoCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = photoCache.keys().next().value
        if (oldestKey !== undefined) photoCache.delete(oldestKey)
    }
    photoCache.set(key, photos)
}

export const unsplashApi = {
    /** Busca fotos por término; paginado (page, perPage). Cachea resultados y deduplica in-flight. */
    searchPhotos: (query: string, page = 1, perPage = 12): Promise<UnsplashSearchResponse> => {
        const key = `${query}:${page}:${perPage}`

        if (photoCache.has(key)) {
            return Promise.resolve({ results: photoCache.get(key)! } as UnsplashSearchResponse)
        }

        if (!inflightRequests.has(key)) {
            const request = (UNSPLASH_API.get('photos', {
                params: { query, page, per_page: perPage },
            }) as Promise<UnsplashSearchResponse>)
                .then((res) => {
                    // No cachear respuestas inválidas (ej. de un content-type correcto
                    // pero payload inesperado) bajo una clave permanente.
                    const results = Array.isArray(res?.results) ? res.results : []
                    cacheSet(key, results)
                    inflightRequests.delete(key)
                    return { ...res, results }
                })
                .catch((err) => {
                    inflightRequests.delete(key)
                    throw err
                })
            inflightRequests.set(key, request)
        }

        return inflightRequests.get(key)!
    },

    /** Registra la descarga en Unsplash (requerido por sus términos de uso). */
    trackDownload: (downloadLocation: string) =>
        UNSPLASH_API.post('/track-download', { downloadLocation }),
}

export default unsplashApi
