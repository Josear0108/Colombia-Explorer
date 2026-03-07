const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
    // Preflight CORS
    if (req.method === 'OPTIONS') {
        return res.status(204).set(CORS_HEADERS).end()
    }

    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v))

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' })
    }

    const { downloadLocation } = req.body ?? {}

    if (!downloadLocation) {
        return res.status(400).json({ message: 'El campo downloadLocation es requerido' })
    }

    const key = process.env.UNSPLASH_ACCESS_KEY
    if (!key) {
        return res.status(500).json({ message: 'API key no configurada' })
    }

    try {
        const response = await fetch(downloadLocation, {
            headers: { Authorization: `Client-ID ${key}` },
        })

        if (!response.ok) {
            console.error('[api/track-download] Unsplash respondió:', response.status)
            return res.status(response.status).json({
                message: `Error al registrar descarga: ${response.status}`,
            })
        }

        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error('[api/track-download] Error:', error)
        return res.status(500).json({ message: 'Error al registrar la descarga' })
    }
}
