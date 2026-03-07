import type { Location } from '../types'

export const CATEGORY_KEYWORDS: Record<string, RegExp> = {
  beach:   /\bplaya\b|\bisla\b|\barrecife\b|\bbuceo\b|\bsnorkel\b|\bcoral\b/i,
  coast:   /\bcartagena\b|\bbarranquilla\b|\bsanta marta\b|\bamurallada\b|\blitoral\b|\bpuerto\b/i,
  jungle:  /\bselva\b|\bparque nacional\b|\bbosque\b|\btayrona\b|\bsierra nevada\b|\breserva natural\b|\bguácharo\b|\bcueva\b|\bamazon/i,
  history: /\bmuseo\b|\bpatrimonio\b|\bcolonial\b|\bhistóric|\bmonumento\b|\bruinas\b|\bcacique\b|\bciudad perdida\b|\bcomunero\b/i,
}

export function filterLocations(
  locations: Location[],
  category: string,
  searchQuery: string,
): Location[] {
  return locations.filter((loc) => {
    const matchesCategory = category === 'all' || (() => {
      const pattern = CATEGORY_KEYWORDS[category]
      if (!pattern) return true
      return pattern.test(`${loc.name} ${loc.description ?? ''}`)
    })()
    const matchesSearch =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
}
