/**
 * Tipos TypeScript para la API de Unsplash.
 * Modelan fotos, respuestas de búsqueda y errores.
 */

/** Foto de Unsplash con URLs en varios tamaños y datos del autor. */
export interface UnsplashPhoto {
    id: string
    /** Descripción opcional de la imagen. */
    description: string | null
    /** URLs de la imagen: raw, full, regular, small, thumb. */
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
    }
    /** Autor de la foto en Unsplash. */
    user: {
        name: string
        username: string
        profileUrl: string
    }
    unsplashUrl: string
    downloadLocation: string
}

/** Respuesta de búsqueda de la API de Unsplash. */
export interface UnsplashSearchResponse {
    results: UnsplashPhoto[]
}