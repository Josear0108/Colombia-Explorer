/**
 * Cliente para la API de Unsplash (vía proxy `/api`).
 * Búsqueda de fotos, foto aleatoria y tracking de descargas.
 */
import axios from 'axios'
import type { UnsplashPhoto, UnsplashSearchResponse } from '../types/unsplash'

/** Instancia axios apuntando a `/api`; interceptores devuelven `data` y normalizan errores. */
const UNSPLASH_API = axios.create({
    baseURL: '/api',
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    }
})

UNSPLASH_API.interceptors.response.use(
    (response) => response.data,
    (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } }; message?: string }
        const message = err.response?.data?.message ?? err.message ?? 'Error al cargar fotos'
        return Promise.reject(new Error(message))
    }
)

/** Cache de resultados: clave = `query:page:perPage` */
const photoCache = new Map<string, UnsplashPhoto[]>()
/** Deduplicación de requests en vuelo (evita doble llamada de React StrictMode) */
const inflightRequests = new Map<string, Promise<UnsplashSearchResponse>>()

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
                    photoCache.set(key, res.results ?? [])
                    inflightRequests.delete(key)
                    return res
                })
                .catch((err) => {
                    inflightRequests.delete(key)
                    throw err
                })
            inflightRequests.set(key, request)
        }

        return inflightRequests.get(key)!
    },

    /** Devuelve una foto aleatoria para el término dado. */
    getRandomPhoto: (query: string) =>
        UNSPLASH_API.get('/random-photo', {
            params: { query },
        }) as Promise<UnsplashPhoto>,

    /** Registra la descarga en Unsplash (requerido por sus términos de uso). */
    trackDownload: (downloadLocation: string) =>
        UNSPLASH_API.post('/track-download', { downloadLocation }),
}

export default unsplashApi