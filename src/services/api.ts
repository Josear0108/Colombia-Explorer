import { createApiClient } from './createClient'
import type { ApiAttraction, ApiPagedResponse, Location } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api-colombia.com/api/v1'

const api = createApiClient(BASE_URL, 15_000)

/** Map a raw API attraction to the app's Location type */
export function mapAttraction(a: ApiAttraction): Location {
  return {
    id: String(a.id),
    name: a.name,
    region: a.city?.name ?? '',
    description: a.description,
    images: a.images ?? [],
    latitude: a.latitude ?? undefined,
    longitude: a.longitude ?? undefined,
    cityPopulation: a.city?.population,
    citySurface: a.city?.surface,
  }
}

/** Fetch only the total record count of any paginated endpoint (1 item, 0 data weight) */
export function fetchTotalCount(endpoint: string): Promise<number> {
  return (api.get(`/${endpoint}/pagedList`, { params: { Page: 1, PageSize: 1 } }) as unknown as Promise<ApiPagedResponse<unknown>>)
    .then((res) => res.totalRecords)
}

export const attractionsApi = {
  /** Fetch paginated list — city is null in list mode */
  getAll: (page = 1, pageSize = 50) =>
    api.get('/TouristicAttraction/pagedList', {
      params: { Page: page, PageSize: pageSize },
    }) as unknown as Promise<ApiPagedResponse<ApiAttraction>>,

  /** Fetch single attraction by id — includes full city data */
  getById: (id: string) => {
    if (!/^\d+$/.test(id)) return Promise.reject(new Error('ID de atracción inválido'))
    return api.get(`/TouristicAttraction/${encodeURIComponent(id)}`) as unknown as Promise<ApiAttraction>
  },
}

export default api
