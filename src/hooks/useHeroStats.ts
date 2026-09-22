import { useState, useEffect } from 'react'
import { fetchTotalCount } from '../services/api'

interface HeroStats {
  attractions: number
  festivals: number
  dishes: number
}

// Fallback values match the confirmed API counts
const DEFAULTS: HeroStats = { attractions: 41, festivals: 160, dishes: 68 }

export function useHeroStats() {
  const [stats, setStats] = useState<HeroStats>(DEFAULTS)

  useEffect(() => {
    Promise.all([
      fetchTotalCount('TouristicAttraction'),
      fetchTotalCount('TraditionalFairAndFestival'),
      fetchTotalCount('TypicalDish'),
    ]).then(([attractions, festivals, dishes]) => {
      setStats({ attractions, festivals, dishes })
    }).catch((err) => {
      console.error('useHeroStats: failed to fetch stats from API, using defaults', err)
    })
  }, [])

  return stats
}
