import { useState, useEffect } from 'react'
import { attractionsApi, mapAttraction } from '../services/api'
import { useAppStore } from '../store/useAppStore'
import type { Location } from '../types'

/** Fetch all tourist attractions (up to 50). Caches results in Zustand to avoid duplicate fetches. */
export function useLocations() {
  const locations = useAppStore((s) => s.locations)
  const setLocations = useAppStore((s) => s.setLocations)

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(locations.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (locations.length > 0) return
    let cancelled = false
    setLoading(true)
    attractionsApi.getAll(1, 50)
      .then((res) => {
        if (!cancelled) {
          setLocations(res.data.map(mapAttraction))
          setTotal(res.totalRecords)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { locations, total, loading, error }
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
