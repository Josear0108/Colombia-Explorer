import { useState, useEffect } from 'react'
import { attractionsApi, mapAttraction } from '../services/api'
import { useAppStore } from '../store/useAppStore'
import type { Location } from '../types'

/** Fetch all tourist attractions (up to 50). Caches results in Zustand to avoid duplicate fetches. */
export function useLocations() {
  const locations = useAppStore((s) => s.locations)
  const setLocations = useAppStore((s) => s.setLocations)

  const [loading, setLoading] = useState(locations.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (locations.length > 0) return
    let cancelled = false
    setLoading(true)
    attractionsApi.getAll(1, 50)
      .then((res) => {
        if (!cancelled) setLocations(res.data.map(mapAttraction))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
    // Deliberately runs once: `locations`/`setLocations` come from the Zustand
    // store (stable across renders), and the `locations.length > 0` guard above
    // prevents refetching once cached.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { locations, loading, error }
}

/** Fetch a single attraction by id — includes full city data. Used in LocationDetail and Gallery. */
export function useLocation(id: string | undefined) {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    setError(null)
    attractionsApi.getById(id)
      .then((data) => {
        if (!cancelled) setLocation(mapAttraction(data))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  return { location, loading, error }
}
