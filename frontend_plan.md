


# Bookstore Project — Frontend Plan
 
This is derived from the backend's API contract (`backend_architecture_and_api_contract.md`). Every endpoint referenced here is exact — don't guess at request/response shapes, ask the backend person if something's unclear.
 
## Tech
- React + React Router
- Axios for API calls (single instance with an interceptor that attaches the JWT from localStorage to every request)
- Context API for global state: `AuthContext` (current user, token, login/logout) and `CartContext` (cart items, add/remove, total). Don't reach for Redux, it's overkill for this scope.
## Pages / Routes
 
| Route | Page | Auth needed | Calls |
|---|---|---|---|
| `/` | Home / catalog | no | `GET /books` (with search/category/pagination params) |
| `/books/:id` | Book detail | no (download button needs auth) | `GET /books/{id}`, `GET /books/{id}/download` if format is EBOOK/AUDIOBOOK and user has purchased it |
| `/login` | Login | no | `POST /auth/login` |
| `/register` | Register | no | `POST /auth/register` |
| `/cart` | Cart | yes | `GET /cart`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}` |
| `/checkout` | Checkout | yes | `POST /orders` |
| `/orders` | Order history | yes | `GET /orders` |
| `/orders/:id` | Order detail | yes | `GET /orders/{id}` |
| `/admin/books` | Admin book management | ADMIN only | `GET/POST/PUT/DELETE /books` |
| `/admin/orders` | Admin order management | ADMIN only | `GET /admin/orders`, `PUT /admin/orders/{id}/status` |
 
## Component Breakdown (rough)
 
- `Navbar` — shows login/logout, cart item count, admin link if role is ADMIN
- `BookCard` / `BookGrid` — catalog display
- `BookDetail` — single book page, "add to cart" button. Books have a `format` field (PHYSICAL/EBOOK/AUDIOBOOK) — show a badge for it. If EBOOK/AUDIOBOOK and the user has purchased it (check their order history), show a "Download"/"Listen" button that hits `GET /books/{id}/download`. Backend returns 403 if not purchased — handle that gracefully, don't just show a broken button.
- `SearchBar` + `CategoryFilter` — feeds query params into `GET /books`
- `CartItem` / `CartSummary` — cart page pieces
- `CheckoutForm` — collects shipping address, calls `POST /orders`
- `OrderCard` — order history list item
- `AdminBookForm` — create/edit book (reused for both). Needs a format dropdown (Physical/Ebook/Audiobook) and a file URL field that only shows/matters when format isn't Physical.
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