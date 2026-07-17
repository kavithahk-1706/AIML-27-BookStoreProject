# Bookstore Project — Frontend Plan

This is derived from the backend's API contract (`backend_architecture_and_api_contract.md`). Every endpoint referenced here is exact — don't guess at request/response shapes, ask the backend person if something's unclear.

> **Changelog note (latest revision):** Format filter dropdown added to catalog (implemented). `BookDetail` now checks `GET /books/{id}/purchase-status` and conditionally shows Read/Listen instead of Add to cart for already-owned digital books. Quantity controls are physical-only — digital cart/detail flows never expose a quantity input. Currency display is ₹ (rupees), not $.

## Tech
- React + React Router
- Axios for API calls (single instance with an interceptor that attaches the JWT from localStorage to every request)
- Context API for global state: `AuthContext` (current user, token, login/logout) and `CartContext` (cart items, add/remove, total). Don't reach for Redux, it's overkill for this scope.

## Pages / Routes

| Route | Page | Auth needed | Calls |
|---|---|---|---|
| `/` | Home / catalog | no | `GET /books` (with search/category/format/pagination params) |
| `/books/:id` | Book detail | no (buy/download actions need auth) | `GET /books/{id}`, `GET /books/{id}/purchase-status` (if logged in and format is EBOOK/AUDIOBOOK), `GET /books/{id}/download` if purchased |
| `/login` | Login | no | `POST /auth/login` |
| `/register` | Register | no | `POST /auth/register` |
| `/cart` | Cart | yes | `GET /cart`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}` |
| `/checkout` | Checkout | yes | `POST /orders` |
| `/orders` | Order history | yes | `GET /orders` |
| `/orders/:id` | Order detail | yes | `GET /orders/{id}` |
| `/admin/books` | Admin book management | ADMIN only | `GET/POST/PUT/DELETE /books` |
| `/admin/orders` | Admin order management | ADMIN only | `GET /admin/orders`, `PUT /admin/orders/{id}/status` |
| `/profile` | Profile | yes | `PUT /auth/me` |

## Component Breakdown (rough)

- `Navbar` — shows login/logout, cart item count, admin link if role is ADMIN
- `BookCard` / `BookGrid` — catalog display
- `BookDetail` — single book page. Books have a `format` field (PHYSICAL/EBOOK/AUDIOBOOK) — show a badge for it.
  - **PHYSICAL:** shows quantity-aware "Add to cart" as before.
  - **EBOOK/AUDIOBOOK, not yet purchased:** shows "Add to cart" with no quantity control (always adds qty 1 — see 4b in the backend contract). No stepper/quantity input rendered at all for digital formats.
  - **EBOOK/AUDIOBOOK, already purchased:** on load, if the user is authenticated, call `GET /books/{id}/purchase-status`. If `purchased: true`, don't show "Add to cart" for this book at all — show the existing Read/Listen button (hits `GET /books/{id}/download`) as the primary action instead. This replaces the old behavior of always showing both a buy option and a conditionally-appearing download button — now it's one or the other, never both, for a digital book the user already owns.
  - If not authenticated, skip the purchase-status call (avoid an unauthenticated request that would just 401) and show the normal "log in to buy" flow as before.
- `SearchBar` + `CategoryFilter` + `FormatFilter` — feeds query params (`search`, `categoryId`, `format`) into `GET /books`. **`FormatFilter` implemented** — same controlled-select pattern as `CategoryFilter`, values `PHYSICAL`/`EBOOK`/`AUDIOBOOK`, combinable with the other two filters, resets to page 0 on change.
- `CartItem` / `CartSummary` — cart page pieces. `CartItem` renders a quantity stepper only for physical items; for a digital cart row it shows a static "Qty: 1" (or equivalent) with no input, since backend enforces quantity 1 for digital regardless (see 4b). This needs the cart response to be able to distinguish format per row — flagged as an open item in the backend contract's Cart section since `BookSummary` doesn't currently carry `format`; confirm with backend before building this piece, don't guess the field name.
- `CheckoutForm` — collects shipping address, calls `POST /orders`
- `OrderCard` — order history list item
- `AdminBookForm` — create/edit book (reused for both). Needs a format dropdown (Physical/Ebook/Audiobook) and a file URL field that only shows/matters when format isn't Physical. **Stock quantity field is now shown only when format is PHYSICAL** — hidden entirely for EBOOK/AUDIOBOOK, and not sent as a required field in the payload for those formats (matches backend's relaxed validation for non-physical `stockQuantity`, see contract 4b).
- `AdminOrderTable` — list of all orders with status dropdown
- `ProtectedRoute` — wrapper component that redirects to `/login` if not authenticated, or blocks non-admins from `/admin/*`

## How Auth Flows on the Frontend

1. User logs in -> backend returns `{token, user}`.
2. Store `token` in localStorage, store `user` in `AuthContext`.
3. Axios interceptor adds `Authorization: Bearer <token>` to every outgoing request automatically.
4. On app load, check localStorage for a token; if present, call `GET /auth/me` to rehydrate the user into context (handles page refresh).
5. On 401 response from any call, log the user out and redirect to `/login`.

## Things NOT to do
- Don't store the password anywhere on the frontend after login.
- Don't build your own "is admin" logic separate from what `/auth/me` returns — trust the backend's role field.
- Don't hardcode API URLs in multiple files — use one `api.js`/`axiosInstance.js` with the base URL as a single constant/env variable.
- Don't invent extra endpoints if something feels missing — flag it to backend instead of mocking data that won't match later.
- Don't render a quantity control anywhere for EBOOK/AUDIOBOOK items (cart or detail page) — the backend enforces quantity 1 for digital regardless, but the UI shouldn't even offer the option, that's a UX signal that quantity is meaningless for a license, not just an arbitrary restriction.
- Don't independently re-derive "has this user purchased this book" client-side from order history — use `GET /books/{id}/purchase-status`, same reasoning as the existing rule about not re-deriving admin status: one source of truth, avoid drift.