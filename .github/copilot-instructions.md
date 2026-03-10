# OrderSync Frontend — Copilot Instructions

## Project Overview

**Campus Karahi** — A multi-tenant restaurant/cafe management platform (React SPA).

**Portals**:

- **Staff Portal** (`/dashboard/*`) — POS, Orders, Kitchen, Reservations, Customers, Invoices, Users, Reports, Settings
- **Customer Portal** (`/cafe/*`) — Menu browsing, cart, checkout, order tracking, wallet
- **QR Menu** (`/m/:qrcode`) — Public QR code-based ordering (no auth)
- **Super Admin** (`/superadmin/*`) — Multi-tenant management

## Build & Dev Commands

```bash
npm run dev       # Dev server (--host, exposes to network)
npm run build     # Production build (Vite)
npm run preview   # Preview production build locally
npm run test      # Run tests
```

## Architecture

**Stack**: React 18 + Vite 5 + React Router 6 + Tailwind CSS 3 + DaisyUI 4

**Key directories**:

- `src/views/` — Page-level components (one per route)
- `src/components/` — Reusable UI components
- `src/controllers/` — Data access functions (async, named exports)
- `src/helpers/` — Auth guards, route protection, utilities
- `src/contexts/` — React Context providers
- `src/config/` — Environment config, RBAC scopes, currencies
- `src/localdb/` — In-memory fake database (dev/demo mode)

**API layer**: `src/helpers/ApiClient.js` is a **fake offline client** that routes all HTTP calls to `LocalDB` for development. It mimics Axios response shape: `{ status, data }`. Errors use `{ response: { status, data: { message } } }`. Do not replace with real Axios calls unless migrating to a live backend.

**Environment variables** live in `src/config/config.jsx`:

```js
API; // VITE_BACKEND base URL
VITE_BACKEND_SOCKET_IO; // WebSocket endpoint
API_IMAGES_BASE_URL; // Image CDN
FRONTEND_DOMAIN; // Domain for redirects
STRIPE_PRODUCT_SUBSCRIPTION_ID;
```

## State Management

React Context API (no Redux). Do not introduce new state libraries.

| Context           | Scope                             |
| ----------------- | --------------------------------- |
| `CafeCartContext` | Shopping cart for customer portal |
| `CustomerContext` | Customer session/auth             |
| `NavbarContext`   | Sidebar collapse state            |
| `SocketContext`   | Socket.io real-time updates       |

Data fetching uses **SWR** for REST calls with caching and refetch. Session is persisted to `localStorage` under the `session_user` key; use helpers in `src/helpers/UserDetails.js` and `src/helpers/AuthStatus.js` to read it.

## Routing & Auth Guards

React Router v6 nested routes. Auth is enforced via wrapper components in `src/helpers/`:

| Guard                      | Used for                                               |
| -------------------------- | ------------------------------------------------------ |
| `PrivateRoute`             | All staff dashboard routes                             |
| `ScopeProtectedRoute`      | RBAC — checks user scopes from `src/config/scopes.jsx` |
| `SuperAdminProtectedRoute` | Super admin portal                                     |
| `CustomerRoute`            | Customer portal protected sections                     |

Scopes (constants in `src/config/scopes.jsx`) control feature access: `DASHBOARD`, `POS`, `KITCHEN`, etc.

## Styling Conventions

Tailwind CSS 3 + DaisyUI 4. **Do not use inline styles** unless Tailwind cannot express it.

**Custom colors** (use these, not raw hex):

```
restro-green-light, restro-green, restro-green-dark
restro-superadmin-widget-bg
theme-orange, theme-dark
```

**Fonts**: `font-["Playfair_Display"]` for branding/titles, `font-["Inter"]` for body.

**Icons**: `@tabler/icons-react` — always use `strokeWidth={1.5}`.

**Accessible components**: Use `@headlessui/react` for modals, dropdowns, and menus (already in use).

## Code Conventions

**Controllers** (`src/controllers/`):

- Named async function exports: `export async function getOrders()`
- Try/catch error handling, JSDoc params
- No class-based patterns

**Components & Views**:

- All `.jsx` files
- Views are wrapped in the `<Page>` component for consistent layout
- Button handler functions prefixed with `btn`: `btnLogout`, `btnShowSearchModal`
- Modal/element IDs use kebab-case: `search-modal`
- State flags use descriptive camelCase: `isNavbarCollapsed`, `isLoading`

**Notifications**: Use `react-hot-toast` (`toast.success`, `toast.error`). Do not use `alert()`.

**Images**: Use `src/helpers/ImageHelper.js` for compression and URL building. Base URL comes from `API_IMAGES_BASE_URL` in config.

## Real-time

Socket.io is initialized in `src/utils/socket.js` and provided via `SocketContext`. Listen for events in views using the context — do not create new socket instances directly.
