import { mapPhoto, requireUnsplashKey, clampInt } from './_lib/unsplash.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' })
    }

    const { query, page, per_page } = req.query

    if (!query) {
        return res.status(400).json({ message: 'El parámetro query es requerido' })
    }

    const key = requireUnsplashKey(res)
    if (!key) return

    const safePage = clampInt(page, 1, 1000, 1)
    const safePerPage = clampInt(per_page, 1, 30, 12)

    const url = new URL('https://api.unsplash.com/search/photos')
    url.searchParams.set('query', Array.isArray(query) ? query[0] : query)
    url.searchParams.set('page', String(safePage))
    url.searchParams.set('per_page', String(safePerPage))

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Client-ID ${key}` },
        })

        if (!response.ok) {
            console.error('[api/photos] Unsplash respondió:', response.status, await response.text().catch(() => ''))
            return res.status(502).json({ message: 'Error al conectar con Unsplash' })
        }

        const data = await response.json()

        // Cacheable en el CDN de Vercel: mismo query = misma respuesta por un buen rato.
        // Reduce directamente el consumo de la cuota de Unsplash entre usuarios.
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

        return res.status(200).json({
            results: (data.results ?? []).map(mapPhoto),
        })
    } catch (error) {
        console.error('[api/photos] Error:', error)
        return res.status(502).json({ message: 'Error al conectar con Unsplash' })
    }
}
