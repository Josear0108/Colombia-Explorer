import axios from 'axios'

/**
 * Crea un cliente axios que normaliza errores y devuelve `response.data` directamente.
 * Rechaza respuestas no-JSON: sin esto, un fallback SPA (ej. Vite sirviendo index.html
 * para una ruta /api/* inexistente) se interpreta como "éxito con resultados vacíos"
 * en vez de como el error real que es.
 */
export function createApiClient(baseURL: string, timeout: number) {
  const client = axios.create({
    baseURL,
    timeout,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.response.use(
    (response) => {
      const contentType = String(response.headers['content-type'] ?? '')
      if (!contentType.includes('application/json')) {
        return Promise.reject(new Error(
          `Respuesta no-JSON de ${response.config.url} (content-type: "${contentType}"). ` +
          `Si estás en desarrollo local, corré 'npm run dev:vercel' en vez de 'npm run dev' ` +
          `para que las funciones de /api respondan.`
        ))
      }
      return response.data
    },
    (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const message = err.response?.data?.message ?? err.message ?? 'Network error'
      return Promise.reject(new Error(message))
    }
  )

  return client
}
