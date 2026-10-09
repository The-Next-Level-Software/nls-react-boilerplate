# Admin Panel Boilerplate

A minimal, clean admin panel starter built with **React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query and Zustand**. Everything project-specific (name, logo, colors, fonts, layout, API URL) lives in **one file**: [`src/config/app.config.ts`](src/config/app.config.ts).

## Features

- **Auth flow**: login (with validation, show/hide password, "keep me signed in"), forgot password, protected routes, redirect back after login
- **Dashboard**: KPI tiles, revenue area chart (range switch + table view), signups by channel, newest users, activity feed
- **Users**: search, role/status/joined-date filters, sorting, pagination, bulk select, activate/suspend/delete, add/edit modal, CSV export. Filters live in the URL, so views are shareable
- **Settings**: profile (with photo upload), password & 2FA, notification preferences, appearance
- **Customization page** (`/customization`, dev only by default): edit everything visually with a live preview, then **Save** to write it into `app.config.ts`
  - 10 theme presets · brand name, tagline, tab title, copyright, support email
  - Logo, dark logo, collapsed-sidebar icon, logo size, favicon (uploads become files in `public/brand/`)
  - Primary, chart, neutral palette, page & card colors per mode, status colors
  - Any Google Font for body/headings, base size, heading weight & spacing
  - Radius, card style (border/shadow/flat), content width, default color mode
  - Sidebar style (default/dark/brand/custom), width, active-item style, section titles; top bar style
  - Login layout (centered/split), panel side, background pattern, texts, image, remember-me / forgot-password toggles
  - Feature toggles (mode switch, search, notifications, help link) · locale & currency
  - Import / export as TypeScript or JSON
- **One-file configuration**: whatever the page edits lives in [`src/config/app.config.ts`](src/config/app.config.ts); you can also edit the file by hand
- **Minimal by default**: monochrome zinc/graphite palette, centered login
- **Light / dark / system** mode with a one-click toggle, with no flash on load
- Collapsible sidebar, mobile drawer navigation, toasts, accessible menus & dialogs, route-level code splitting
- **Mock API by default**: runs with no backend; set one env variable to switch to your real API

## Quick start

```bash
npm install
npm run dev
```

Sign in with **admin@example.com / password** (the login page can fill these in for you).

| Script              | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the dev server                    |
| `npm run build`     | Type-check and build to `dist`          |
| `npm run preview`   | Serve the production build              |
| `npm run lint`      | ESLint                                  |
| `npm run typecheck` | TypeScript only                         |
| `npm run format`    | Prettier (incl. Tailwind class sorting) |

## Starting a new project from this template

1. Click **Use this template** on GitHub (or clone and re-init git).
2. `npm install && npm run dev`, sign in, and open **Customization** in the sidebar.
3. Pick a preset or set your logo, colors, fonts, layout and login page. Everything previews live across the app (open the Dashboard or Users page to check).
4. Click **Save**. The dev server rewrites [`src/config/app.config.ts`](src/config/app.config.ts) and stores uploaded images in `public/brand/`. Commit both.
5. **Backend**: copy `.env.example` to `.env` and set `VITE_API_URL` (see below). Turn off the demo credentials hint for production.
6. **Navigation**: add your pages in [`src/config/navigation.ts`](src/config/navigation.ts) and [`src/router.tsx`](src/router.tsx).
7. Update `name` in `package.json` and the `<title>` / description in `index.html`.

### How the configuration works

- [`src/config/app.config.ts`](src/config/app.config.ts) is the single source of truth. Every option is commented with its allowed values, so editing it by hand works just as well.
- The Customization page edits a draft of that config. The draft is applied live, kept in `sessionStorage` until you save or discard, and dropped automatically if the file changes.
- **Save** (dev only) posts the draft to a small Vite plugin ([`vite/config-writer.ts`](vite/config-writer.ts)) that regenerates the file through [`render-config.ts`](src/config/render-config.ts), so its layout and comments stay the same. Images from earlier saves that are no longer used are removed from `public/brand/`.
- **Export** gives the same file (or JSON) to copy or download. **Import** loads a JSON export, for example to reuse a client's theme in another project.
- `features.customizer` controls availability: `'dev'` (default; page only exists under `npm run dev`), `'always'` (also in production builds, where it previews in the browser and can export but not save), or `'off'`.
- `app.config.ts` is excluded from Prettier because it is generated.

## Connecting your API

While `VITE_API_URL` is empty, services in [`src/services`](src/services) return mock data from [`src/mocks`](src/mocks). Once it's set, they call your API through a small fetch client ([`src/services/http.ts`](src/services/http.ts)) that sends `Authorization: Bearer <token>` and signs the user out on `401`.

Endpoints the services expect (adjust paths and shapes to match your backend):

| Method   | Path                    | Used by                                                                                                                               |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/auth/login`           | `{ user, token }` on success                                                                                                          |
| `POST`   | `/auth/logout`          | Sign out                                                                                                                              |
| `POST`   | `/auth/forgot-password` | Forgot password                                                                                                                       |
| `PATCH`  | `/me`                   | Profile                                                                                                                               |
| `POST`   | `/me/password`          | Change password                                                                                                                       |
| `GET`    | `/dashboard/overview`   | Dashboard                                                                                                                             |
| `GET`    | `/users`                | List. Query: `search, role, status, joinedFrom, joinedTo, sortBy, sortDir, page, pageSize`. Returns `{ data, total, page, pageSize }` |
| `POST`   | `/users`                | Create user                                                                                                                           |
| `PATCH`  | `/users/:id`            | Update user                                                                                                                           |
| `DELETE` | `/users/:id`            | Delete user                                                                                                                           |

## Project structure

```
src/
├─ config/            # ← start here: app.config (all settings), render-config, navigation
├─ theme/             # theme engine: palettes, fonts, color utils, applyTheme()
├─ store/             # Zustand stores: auth, theme, ui, toasts
├─ services/          # API layer (mock ↔ real switch lives here)
├─ mocks/             # mock data used while no API is configured
├─ components/
│  ├─ ui/             # Button, Input, Select, Modal, DropdownMenu, Pagination, …
│  ├─ layout/         # AppLayout, Sidebar, Topbar, Logo, UserMenu, PageHeader
│  └─ auth/           # route guards
├─ pages/             # auth, dashboard, users, settings, customization, errors
├─ hooks/  lib/  types/
├─ router.tsx
└─ main.tsx
vite/
└─ config-writer.ts   # dev-server endpoint behind the Customization page's Save button
```

## How theming works

- Every color, the radius and the fonts are **CSS variables** set on `<html>` by [`applyTheme()`](src/theme/apply-theme.ts) from `app.config.ts`.
- Tailwind maps them to utilities in [`src/index.css`](src/index.css): `bg-background`, `bg-surface`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-primary-soft`, `bg-chart`, `bg-sidebar`, `text-success|warning|danger|info`, and so on. Use the `card` utility for card surfaces so they follow `layout.cardStyle`.
- Read the live config in components with `useConfig()` (from `@/store/config.store`) rather than importing `appConfig` directly, so the Customization preview updates them.
- Use these tokens instead of fixed colors (`bg-white`, `text-gray-500`) in new components, and they will follow the brand and dark mode automatically.
- Dark mode is the `.dark` class on `<html>` (`dark:` variant works as usual). An inline script in `index.html` applies it before first paint.

## Adding a page

1. Create `src/pages/reports/ReportsPage.tsx` and start it with `<PageHeader title="Reports" />` (this also sets the tab title).
2. Add a route in `src/router.tsx`:
   ```ts
   { path: 'reports', lazy: () => import('@/pages/reports/ReportsPage').then((m) => ({ Component: m.ReportsPage })) }
   ```
3. Add a nav item in `src/config/navigation.ts`.

## Deployment

It's a static SPA: deploy `dist/` anywhere. Configure your host to rewrite unknown paths to `/index.html` (e.g. Netlify `_redirects`: `/* /index.html 200`; Vercel: a rewrite to `/index.html`), so deep links like `/users` work on refresh.
