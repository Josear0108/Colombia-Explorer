// Helpers compartidos por las funciones serverless de /api. El prefijo `_` evita
// que Vercel despliegue este archivo como una función propia.

export const UTM = 'utm_source=colombia_explorer&utm_medium=referral'

export function mapPhoto(photo) {
    return {
        id: photo.id,
        description: photo.description ?? photo.alt_description ?? null,
        urls: photo.urls,
        user: {
            name: photo.user.name,
            username: photo.user.username,
            profileUrl: `${photo.user.links.html}?${UTM}`,
        },
        unsplashUrl: `${photo.links.html}?${UTM}`,
        downloadLocation: photo.links.download_location,
    }
}

/** Lee la API key server-side; responde 500 y devuelve null si falta. */
export function requireUnsplashKey(res) {
    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
        res.status(500).json({ message: 'API key no configurada' })
        return null
    }
    return key
}

/** Clampa un parámetro numérico de query (que puede llegar como array si se repite). */
export function clampInt(value, min, max, fallback) {
    const raw = Array.isArray(value) ? value[0] : value
    const n = parseInt(raw, 10)
    if (!Number.isFinite(n)) return fallback
    return Math.min(Math.max(n, min), max)
}
