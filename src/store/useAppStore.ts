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
  locations: Location[]
  setLocations: (locations: Location[]) => void
  favouriteIds: Set<string>
  toggleFavourite: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  locations: [],
  setLocations: (locations) => set({ locations }),

  favouriteIds: loadFavourites(),
  toggleFavourite: (id) =>
    set((state) => {
      const next = new Set(state.favouriteIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavourites(next)
      return { favouriteIds: next }
    }),
}))

export default useAppStore
