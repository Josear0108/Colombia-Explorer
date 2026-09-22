import { requireUnsplashKey } from './_lib/unsplash.js'

const ALLOWED_HOST = 'api.unsplash.com'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' })
    }

    const { downloadLocation } = req.body ?? {}

    if (!downloadLocation) {
        return res.status(400).json({ message: 'El campo downloadLocation es requerido' })
    }

    // SSRF guard: downloadLocation viene del cliente. Sin este check, un atacante
    // puede pasar cualquier URL y el fetch de abajo le envía nuestra API key
    // en el header Authorization directo a su servidor.
    let target
    try {
        target = new URL(downloadLocation)
    } catch {
        return res.status(400).json({ message: 'downloadLocation inválido' })
    }
    if (target.protocol !== 'https:' || target.hostname !== ALLOWED_HOST) {
        console.error('[api/track-download] downloadLocation fuera de allowlist:', downloadLocation)
        return res.status(400).json({ message: 'downloadLocation inválido' })
    }

    const key = requireUnsplashKey(res)
    if (!key) return

    try {
        const response = await fetch(target.toString(), {
            headers: { Authorization: `Client-ID ${key}` },
        })

        if (!response.ok) {
            console.error('[api/track-download] Unsplash respondió:', response.status)
            return res.status(502).json({ message: 'Error al registrar la descarga' })
        }

        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error('[api/track-download] Error:', error)
        return res.status(502).json({ message: 'Error al registrar la descarga' })
    }
}
