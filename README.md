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
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?labelColor=1e293b" alt="License" /></a>
</p>

---

## Features

- **Home** — Hero section with animated stats (attractions, festivals, dishes) pulled live from the API
- **Destinations** — Paginated, searchable, and filterable grid of tourist attractions across Colombia
- **Location Detail** — Full detail view per attraction: city data, surface, population, coordinates
- **Photo Gallery** — Unsplash-powered image gallery per location
- **Internationalization** — English / Spanish via `react-i18next` with automatic browser language detection
- **Global state** — Zustand store for filters, search query, and pagination
- **Smooth animations** — Motion (Framer Motion v12) for page transitions and count-up stats
- **Skeleton loaders** — Card skeletons during data fetching

---

## Project Structure

```
src/
├── components/
│   ├── features/       # HeroSection, CategoryList, LocationCard
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Button, Badge, Card, Loader, CountUp, Skeleton
├── hooks/              # useLocations, useUnsplashPhotos, useHeroStats
├── pages/              # Home, Destinations, LocationDetail, Gallery
├── services/           # api.ts (API Colombia), unsplashApi.ts
├── store/              # useAppStore (Zustand)
├── types/              # index.ts, unsplash.ts
├── utils/              # categoryFilter.ts
└── i18n/               # i18next config + translation files
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

Create a `.env` file in the project root:

```env
# Optional — defaults to https://api-colombia.com/api/v1
VITE_API_BASE_URL=https://api-colombia.com/api/v1

# Required for the photo gallery (server-side, no VITE_ prefix)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

> **Note:** `UNSPLASH_ACCESS_KEY` is consumed by the Vercel serverless functions in `/api/` and must **not** have the `VITE_` prefix — it is never exposed to the browser.

### Run

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

---

## APIs

### API Colombia

This app consumes [API Colombia](https://api-colombia.com) — a free, open REST API with data about Colombian tourist attractions, cities, departments, festivals, presidents, and more.

Key endpoints used:

| Endpoint | Description |
|---|---|
| `GET /TouristicAttraction/pagedList` | Paginated list of tourist attractions |
| `GET /TouristicAttraction/:id` | Single attraction with full city data |
| `GET /Festival/pagedList` | Total festival count (hero stats) |
| `GET /TypicalDish/pagedList` | Total dishes count (hero stats) |

### Unsplash

Photo galleries are powered by the [Unsplash API](https://unsplash.com/developers). Because the API key must stay secret, all requests are proxied through three Vercel serverless functions:

| Vercel Function | Proxies to | Description |
|---|---|---|
| `GET /api/photos` | `GET /search/photos` | Search photos by query, paginated |
| `GET /api/random-photo` | `GET /photos/random` | Random photo for a given query |
| `POST /api/track-download` | `POST /photos/:id/download` | Track downloads (required by Unsplash ToS) |

The client (`src/services/unsplashApi.ts`) calls `/api/*` — the proxy adds the `Authorization: Client-ID` header server-side using `UNSPLASH_ACCESS_KEY`.

---

## License

MIT
