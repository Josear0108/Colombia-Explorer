import { create } from 'zustand'
import type { Location } from '../types'

const FAVS_KEY = 'colombia_explorer_favs'

function loadFavourites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVS_KEY)
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

function saveFavourites(ids: Set<string>) {
  try {
    localStorage.setItem(FAVS_KEY, JSON.stringify([...ids]))
  } catch { /* ignore */ }
}

interface AppState {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  locations: Location[]
  setLocations: (locations: Location[]) => void
  favouriteIds: Set<string>
  toggleFavourite: (id: string) => void
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  locations: [],
  setLocations: (locations) => set({ locations }),

  favouriteIds: loadFavourites(),
  toggleFavourite: (id) =>
    set((state) => {
      const next = new Set(state.favouriteIds)
      next.has(id) ? next.delete(id) : next.add(id)
      saveFavourites(next)
      return { favouriteIds: next }
    }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useAppStore
