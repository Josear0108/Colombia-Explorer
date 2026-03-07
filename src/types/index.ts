// ─── API Colombia raw types ───────────────────────────────────────────────────

export interface ApiCity {
  id: number
  name: string
  description: string
  surface: number
  population: number
  postalCode: string
  departmentId: number
}

export interface ApiAttraction {
  id: number
  name: string
  description: string
  images: string[]
  latitude: string
  longitude: string
  cityId: number
  city: ApiCity | null
}

export interface ApiPagedResponse<T> {
  page: number
  pageSize: number
  totalRecords: number
  pageCount: number
  data: T[]
}

// ─── Domain models (app-level) ────────────────────────────────────────────────

export interface Location {
  id: string
  name: string
  region: string          // city name from API
  description?: string
  images: string[]
  latitude?: string
  longitude?: string
  cityPopulation?: number
  citySurface?: number
}

export type LocationDetail = Location

export interface GalleryPhoto {
  id: string
  url: string
  alt?: string
  locationId: string
}

// ─── UI variants ──────────────────────────────────────────────────────────────

export type BadgeVariant = 'primary' | 'yellow' | 'green' | 'red' | 'gray'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
