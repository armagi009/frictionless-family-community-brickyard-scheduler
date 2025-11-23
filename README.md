# Frictionless Family — Community Brickyard Scheduler

[cloudflarebutton]

## Overview

Frictionless Family is a production-grade, visually-rich scheduling frontend built on Cloudflare Workers with Durable Objects for persistence. Designed for "The Community Brickyard," a community Lego club, it streamlines family logistics by providing an intelligent session discovery engine, family profiles with child-specific preferences, and a seamless one-click booking, approval, and calendar-sync workflow. The app emphasizes playful, Lego-inspired visuals with rounded shapes, bright primary colors, and smooth micro-interactions, ensuring a delightful user experience for parents and children alike.

This project follows a mobile-first, accessible design philosophy, leveraging a single Durable Object for scalable entity-based storage across sessions, profiles, bookings, and inventory.

## Key Features

- **Intelligent Session Discovery**: Master calendar with filters for age, interest tags (e.g., Space, Castles), and session types (Open Play, Themed Workshops).
- **Family Profiles**: Create and manage profiles for parents and children, including ages, nicknames, and interest tags for personalized recommendations.
- **Booking Workflow**: Request bookings that enter a pending state, with one-click parent approval via tokenized links; triggers .ics calendar file generation and download.
- **Idea Buffet Catalog**: Interactive showcase of pre-built Lego sets with QR codes, shelf labels, and inspiration links.
- **Approvals Inbox**: Dedicated view for parents to review and approve/decline pending requests.
- **Legacy Wall Gallery**: Cycling display of community creations and build challenges.
- **Mock Admin Dashboard**: Lightweight interface for session management (expandable in future phases).
- **Calendar Sync**: Automatic .ics export with session details, location, and instructions.
- **Visual Excellence**: Kid-playful UI with Lego-themed elements, responsive layouts, and 60fps animations.

The system reduces booking friction, increases session relevance through preferences, and ensures reliable calendar integration.

## Tech Stack

- **Frontend**: React 18, TypeScript, React Router 6, Tailwind CSS 3, shadcn/ui components, Framer Motion (animations), Zustand (state management), Lucide React (icons), Sonner (toasts), Date-fns (dates), React Day Picker (calendar UI).
- **Backend**: Hono (routing), Cloudflare Workers, Durable Objects (via custom Entity/Index system for persistence).
- **Styling & UI**: Tailwind CSS with custom animations, CSS variables for theming (light/dark modes).
- **Utilities**: Immer (immutable updates), Zod (validation), UUID (IDs).
- **Build & Deploy**: Vite (bundler), Bun (package manager), Wrangler (Cloudflare CLI).
- **Other**: Recharts (charts, optional), React Hook Form (forms, optional).

No external databases or services are required; all data is stored in a single Durable Object namespace.

## Quick Start

### Prerequisites

- Node.js 18+ (or Bun 1.0+ for faster installs).
- Cloudflare account with Workers enabled.
- Wrangler CLI installed: `bun install -g wrangler`.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd frictionless-family
   ```

2. Install dependencies using Bun:
   ```
   bun install
   ```

3. (Optional) Generate TypeScript types for Workers:
   ```
   bun run cf-typegen
   ```

### Development

1. Start the development server (runs on http://localhost:3000):
   ```
   bun run dev
   ```

2. In a separate terminal, deploy or test the Worker backend:
   ```
   bun run deploy  # For production-like testing
   ```

The frontend proxies API calls to the Worker. Hot-reloading is enabled for React changes. Use the provided demo data in `shared/mock-data.ts` as a starting point—replace with Lego session seeds.

#### Adding New Features

- **Frontend Pages**: Add routes in `src/main.tsx` using React Router. Wrap pages with the root layout: `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="py-8 md:py-10 lg:py-12">{content}</div></div>`.
- **API Endpoints**: Extend `worker/user-routes.ts` using the Entity patterns. Define types in `shared/types.ts`. Use `IndexedEntity` for listable entities (e.g., Sessions, Bookings).
- **Entities**: Create new classes in `worker/entities.ts` extending `IndexedEntity<S>` with static `indexName`, `initialState`, and optional `seedData`.
- **State Management**: Use Zustand with primitive selectors (e.g., `useStore(s => s.count)`) to avoid re-render loops.
- **Styling**: Extend Tailwind config in `tailwind.config.js`. Prefer shadcn/ui imports from `@/components/ui/*` and compose with Tailwind utilities.
- **Testing**: Lint with `bun run lint`. Test API with tools like Postman against `/api/*` endpoints.

#### Common Development Commands

- Build for production: `bun run build`
- Preview build: `bun run preview`
- Lint code: `bun run lint`

## Usage

### Running the App

- Access the app at `http://localhost:3000` during dev.
- Navigate via the top header: Home, Sessions, Profiles, Bookings, Idea Buffet, Approvals, Legacy Wall.
- Create a family profile, browse sessions, request a booking, and approve via the inbox—triggers .ics download.
- Guest mode available; mock auth via local storage.

### Example API Usage (from Frontend or curl)

All endpoints return `ApiResponse<T>` JSON. Base URL: your Worker domain (e.g., `https://your-worker.your-account.workers.dev`).

- **List Sessions**: `GET /api/sessions` (paginated via `?cursor=abc&limit=10`)
- **Create Family Profile**: `POST /api/families` with JSON `{ name: "Family Name", children: [{ nickname: "Alex", age: 8, tags: ["Space"] }] }`
- **Request Booking**: `POST /api/bookings` with `{ sessionId: "sess-123", familyId: "fam-456", childId: "child-789", message: "Excited!" }` (returns pending booking with approval token)
- **Approve Booking**: `POST /api/bookings/:id/approve?token=uuid` (generates .ics download)
- **List Idea Buffet Sets**: `GET /api/sets`

Seed data auto-populates on first access via `ensureSeed` in entities.

### Frontend Components

- Use `AppLayout` for sidebar-enabled pages.
- Theme toggle via `ThemeToggle` (light/dark).
- API calls: Import `api` from `@/lib/api-client.ts` for typed fetches.
- Error handling: Wrapped in `ErrorBoundary`; report via `/api/client-errors`.

## Deployment

Deploy to Cloudflare Workers for global edge execution with Durable Object storage.

1. Authenticate Wrangler:
   ```
   wrangler login
   ```

2. Configure secrets (if needed, e.g., for future email integrations):
   ```
   wrangler secret put EMAIL_KEY
   ```

3. Build and deploy:
   ```
   bun run deploy
   ```

4. Your app will be live at `https://frictionless-family.your-subdomain.workers.dev`. Update the frontend's API base URL if needed (via env vars in Vite).

For CI/CD, integrate with GitHub Actions using Wrangler actions.

[cloudflarebutton]

### Custom Domain

Bind a custom domain via Wrangler:
```
wrangler pages domain add yourdomain.com
```

### Monitoring

- Use Cloudflare Dashboard for logs, metrics, and Durable Object alarms.
- Observability is enabled in `wrangler.jsonc`.

## Contributing

1. Fork the repo and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit changes (`git commit -m 'Add some amazing feature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

Follow the blueprint phases for iterative development: Phase 1 focuses on frontend foundation; subsequent phases add workflows and integrations.

Report issues for bugs or feature requests. Ensure code adheres to TypeScript strict mode and Tailwind v3-safe patterns.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.