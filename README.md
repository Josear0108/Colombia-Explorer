<p align="center">
  <img src="public/logo-colombia-explorer.png" alt="Colombia Explorer" width="120" />
</p>

<h1 align="center">Colombia Explorer</h1>

<p align="center">
  Discover the tourist attractions, festivals, and gastronomy of Colombia — built with React, Vite, and the <a href="https://api-colombia.com">API Colombia</a> public API.
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&labelColor=1e293b" alt="TypeScript" /></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&labelColor=1e293b" alt="Vite" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=0f172a" alt="Tailwind CSS" /></a>
  <a href="https://zustand-demo.pmnd.rs"><img src="https://img.shields.io/badge/Zustand-5-FF6B35?logo=react&logoColor=white&labelColor=1a1a2e" alt="Zustand" /></a>
  <a href="https://motion.dev"><img src="https://img.shields.io/badge/Motion-12-FF0055?logo=framer&logoColor=white&labelColor=0d0d0d" alt="Motion" /></a>
  <a href="https://www.i18next.com"><img src="https://img.shields.io/badge/i18next-ES%20%7C%20EN-26A69A?logo=i18next&logoColor=white&labelColor=1e293b" alt="i18n" /></a>
  <a href="https://colombia-explorer-cyan.vercel.app"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white" alt="Deployed on Vercel" /></a>
</p>

---

## Features

- **Home** — Hero section with animated stats (attractions, festivals, dishes) pulled live from the API
- **Destinations** — Searchable and filterable grid of tourist attractions across Colombia (fetches the first 50; no pagination yet)
- **Location Detail** — Full detail view per attraction: city data, surface, population, coordinates
- **Photo Gallery** — Unsplash-powered image gallery per location
- **Internationalization** — English / Spanish via `react-i18next` with automatic browser language detection
- **Global state** — Zustand store for the fetched locations list and favourites (persisted to `localStorage`)
- **Smooth animations** — Motion (Framer Motion v12) for page transitions and count-up stats
- **Skeleton loaders** — Card skeletons during data fetching

---

## Project Structure

```
src/
├── components/
│   ├── features/       # HeroSection, CategoryList, LocationCard, LocationResults
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Button, Loader, CountUp, Skeleton
├── config/             # navigation.ts (shared nav items)
├── constants/          # unsplash.ts (attribution URL)
├── hooks/              # useLocations, useUnsplashPhotos, useHeroStats
├── pages/              # Home, Destinations, LocationDetail, Gallery, NotFound
├── services/           # createClient.ts (shared axios factory), api.ts, unsplashApi.ts
├── store/              # useAppStore (Zustand)
├── types/              # index.ts, unsplash.ts
├── utils/              # categoryFilter.ts
└── i18n/               # i18next config + translation files

api/                    # Vercel serverless functions (proxy to Unsplash, see below)
├── _lib/unsplash.js    # shared helpers (not deployed as a function — `_` prefix)
├── photos.js
└── track-download.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- An [Unsplash Developer](https://unsplash.com/developers) account for the photo gallery (free)

### Installation

```bash
git clone https://github.com/your-username/colombia-explorer-finally.git
cd colombia-explorer-finally
npm install
```

### Environment Variables

Create a `.env.local` file in the project root (used by both Vite and `vercel dev`):

```env
# Optional — defaults to https://api-colombia.com/api/v1
VITE_API_BASE_URL=https://api-colombia.com/api/v1

# Required for the photo gallery (server-side, no VITE_ prefix)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

> **Note:** `UNSPLASH_ACCESS_KEY` is consumed by the Vercel serverless functions in `/api/` and must **not** have the `VITE_` prefix — it is never exposed to the browser.

### Run

```bash
npm run dev         # Vite dev server only — /api/* routes will NOT work (see note below)
npm run dev:vercel  # Vite + Vercel's local runtime — required for the photo gallery to work locally
npm run build       # production build
npm run preview     # preview production build
```

> **Note:** `npm run dev` runs Vite alone. The functions in `/api/` are Vercel serverless
> functions — Vite doesn't execute them, and any request to `/api/*` falls through to Vite's
> SPA fallback (served as HTML, not JSON). Use `npm run dev:vercel` (wraps `vercel dev`,
> requires the [Vercel CLI](https://vercel.com/docs/cli)) whenever you need the photo
> gallery to work in local development.

---

## APIs

### API Colombia

This app consumes [API Colombia](https://api-colombia.com) — a free, open REST API with data about Colombian tourist attractions, cities, departments, festivals, presidents, and more.

Key endpoints used:

| Endpoint | Description |
|---|---|
| `GET /TouristicAttraction/pagedList` | Paginated list of tourist attractions |
| `GET /TouristicAttraction/:id` | Single attraction with full city data |
| `GET /TraditionalFairAndFestival/pagedList` | Total festival count (hero stats) |
| `GET /TypicalDish/pagedList` | Total dishes count (hero stats) |

### Unsplash

Photo galleries are powered by the [Unsplash API](https://unsplash.com/developers). Because the API key must stay secret, all requests are proxied through Vercel serverless functions in `/api/`:

| Vercel Function | Proxies to | Description |
|---|---|---|
| `GET /api/photos` | `GET /search/photos` | Search photos by query (page/per_page clamped server-side) |
| `POST /api/track-download` | `POST /photos/:id/download` | Track downloads (required by Unsplash ToS); validates the target host against an allowlist |

The client (`src/services/unsplashApi.ts`) calls `/api/*` — same-origin, so there's no CORS layer. The proxy adds the `Authorization: Client-ID` header server-side using `UNSPLASH_ACCESS_KEY`, which is never exposed to the browser.

> **Known limitation:** these endpoints have no rate limiting yet. On Unsplash's free Demo
> plan (50 req/hour), sustained abuse of `/api/photos` from a single client can exhaust the
> shared quota for all users. Adding real per-IP rate limiting requires an external store
> (e.g. Upstash Redis) and is tracked as follow-up work, not solved by this proxy alone.

---

## License

All rights reserved. This is proprietary source code — no license is granted to use, copy,
modify, or redistribute it without explicit permission from the copyright holder.

© 2026 Jose Arguello
