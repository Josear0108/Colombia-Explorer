const UTM = 'utm_source=colombia_explorer&utm_medium=referral'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function mapPhoto(photo) {
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

export default async function handler(req, res) {
    // Preflight CORS
    if (req.method === 'OPTIONS') {
        return res.status(204).set(CORS_HEADERS).end()
    }

    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v))

    const { query, page = 1, per_page = 12 } = req.query

    if (!query) {
        return res.status(400).json({ message: 'El parámetro query es requerido' })
    }

    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
        return res.status(500).json({ message: 'API key no configurada' })
    }

    const url = new URL('https://api.unsplash.com/search/photos')
    url.searchParams.set('query', query)
    url.searchParams.set('page', String(page))
    url.searchParams.set('per_page', String(per_page))

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Client-ID ${key}` },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return res.status(response.status).json({
                message: errorData.errors?.[0] ?? `Error de Unsplash: ${response.status}`,
            })
        }

        const data = await response.json()

        return res.status(200).json({
            total: data.total,
            totalPages: data.total_pages,
            results: data.results.map(mapPhoto),
        })
    } catch (error) {
        console.error('[api/photos] Error:', error)
        return res.status(500).json({ message: 'Error al conectar con Unsplash' })
    }
}
