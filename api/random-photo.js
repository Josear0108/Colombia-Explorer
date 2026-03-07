const UTM = 'utm_source=colombia_explorer&utm_medium=referral'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
    // Preflight CORS
    if (req.method === 'OPTIONS') {
        return res.status(204).set(CORS_HEADERS).end()
    }

    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v))

    const { query } = req.query

    if (!query) {
        return res.status(400).json({ message: 'El parámetro query es requerido' })
    }

    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
        return res.status(500).json({ message: 'API key no configurada' })
    }

    const url = new URL('https://api.unsplash.com/photos/random')
    url.searchParams.set('query', query)

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

        const photo = await response.json()

        return res.status(200).json({
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
        })
    } catch (error) {
        console.error('[api/random-photo] Error:', error)
        return res.status(500).json({ message: 'Error al conectar con Unsplash' })
    }
}
