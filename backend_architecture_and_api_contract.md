# Bookstore Project — Backend Architecture & API Contract
**This is the single source of truth. Frontend, backend, and docs all derive from this file. If something isn't in here, it's not in the project (or it's a stretch goal explicitly marked as such).**

---

## 1. Tech Stack (locked, non-negotiable)

- **Backend:** Spring Boot (latest stable version you have installed — e.g. 4.1.0. Not pinning an exact number here, just don't let anything downgrade you off Spring Security)
- **Security:** Spring Security + JWT (stateless, no sessions)
- **Persistence:** Spring Data JPA (Hibernate) + MySQL
- **Frontend:** React + React Router + Axios
- **Password hashing:** BCrypt (via Spring Security's `PasswordEncoder`)

No substitutions. No "let's just do manual auth checks instead of Spring Security." No swapping MySQL for H2/Mongo mid-project. No swapping Axios/fetch back and forth. **No real/third-party payment gateway — a simulated payment step is required, see section 4a.** Pick it once, here, and stick to it.

### Service layer pattern
Each service is an **interface + implementation class** (e.g. `BookService` interface, `BookServiceImpl` class), not a single concrete class. Controllers depend on the interface type. Use this pattern throughout — extra file per service, but cleaner for testing/mocking.

---

## 2. High-Level Architecture

```
React (frontend)
   |  HTTPS + JSON, JWT in Authorization header
   v
Spring Boot REST API
   |-- Controller layer   (HTTP in/out, validation, maps to DTOs)
   |-- Service layer      (business logic — cart totals, stock checks, order creation)
   |-- Repository layer   (Spring Data JPA interfaces)
   |-- Security layer     (JWT filter -> SecurityContext -> role-based endpoint rules)
   v
MySQL
```

Standard 3-layer backend (Controller -> Service -> Repository). Don't let anyone talk you into skipping the service layer and putting business logic in controllers — it's a common "simplification" that makes the code impossible to test or grade cleanly.

---

## 3. Database Schema

### `users`
| column | type | notes |
|---|---|---|
| id | BIGINT PK auto-increment | |
| name | VARCHAR(100) | |
| email | VARCHAR(150) UNIQUE | login identifier |
| password_hash | VARCHAR(255) | BCrypt hash, never plaintext |
| role | ENUM('USER','ADMIN') | default USER |
| created_at | TIMESTAMP | |

### `categories`
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| name | VARCHAR(100) UNIQUE | e.g. Fiction, Sci-Fi, Non-Fiction |

### `books`
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| title | VARCHAR(255) | |
| author | VARCHAR(255) | |
| isbn | VARCHAR(20) | |
| description | TEXT | |
| price | DECIMAL(10,2) | |
| stock_quantity | INT | |
| category_id | BIGINT FK -> categories.id | |
| image_url | VARCHAR(500) | nullable |
| format | ENUM('PHYSICAL','EBOOK','AUDIOBOOK') | default PHYSICAL |
| file_url | VARCHAR(500) | nullable — only set when format is EBOOK/AUDIOBOOK, points to where the file lives on the server. Never exposed as a public static URL. |
| created_at | TIMESTAMP | |

### `cart_items`
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK -> users.id | |
| book_id | BIGINT FK -> books.id | |
| quantity | INT | |

One row per (user, book) — enforce a unique constraint on (user_id, book_id), adding to cart twice should increment quantity, not duplicate rows.

### `orders`
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK -> users.id | |
| total_amount | DECIMAL(10,2) | snapshot at time of order |
| status | ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') | default PENDING |
| payment_status | ENUM('PENDING','PAID','FAILED') | default PENDING — see 4a below |
| shipping_address | VARCHAR(500) | |
| created_at | TIMESTAMP | |

`status` semantics, made explicit now that payment is a real step:
- `PENDING` — order created, stock reserved (decremented), payment not yet confirmed.
- `CONFIRMED` — payment succeeded, sale finalized. This is the status the download-gating query already checks (`OrderItemRepository.userHasPurchasedBook` looks for `CONFIRMED`/`DELIVERED`) — paying is literally what unlocks EBOOK/AUDIOBOOK access.
- `CANCELLED` — also used when payment fails; stock reserved at checkout is released back (see 4a).
- `SHIPPED` / `DELIVERED` — unchanged, physical fulfillment only.

### `order_items`
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| order_id | BIGINT FK -> orders.id | |
| book_id | BIGINT FK -> books.id | |
| quantity | INT | |
| price_at_purchase | DECIMAL(10,2) | snapshot — don't recompute from current book price later |

### Stretch: `reviews`
| id | book_id FK | user_id FK | rating (1-5) | comment TEXT | created_at |

### Stretch: `wishlist`
| id | user_id FK | book_id FK |

---

## 4. Feature List

### MVP (build this first, in this order)
1. User registration + login (JWT issued on login)
2. Book catalog: list, search by title/author, filter by category, pagination
3. Book detail page (shows format: physical/ebook/audiobook)
4. Cart: add/update/remove items (auth required)
5. Checkout: cart -> order, reserves (decrements) stock, clears cart, order starts as PENDING/PENDING
4a. Simulated payment: a separate step that confirms or fails the order — see "Simulated Payment Flow" below
6. Order history for logged-in user
7. Admin: CRUD on books (including format + file upload/URL), view all orders, update order status
8. Digital delivery: secured download/stream endpoint for EBOOK/AUDIOBOOK formats, gated on "has this user actually purchased this book" (i.e. order status CONFIRMED/DELIVERED)

### Stretch (only if time genuinely remains after MVP + item 8 above)
- Reviews/ratings on books
- Wishlist
- Sorting (price low-high, newest, rating)
- COD integration: that requires a whole different flow that bypasses the /payment endpoint- too much complexity for now

### Explicitly out of scope
- **Real** payment gateway integration (Stripe, Razorpay, or otherwise) — no real money moves, no external API calls, no webhooks. A **simulated** payment step is in scope and required (see section 4a / "Simulated Payment Flow" below) — it's a self-contained endpoint on our own backend, not a third-party integration.


**Do not start stretch features before MVP + digital delivery are fully working end-to-end.** This is the #1 way group projects run out of time.

---

## 4a. Simulated Payment Flow

Payment is a real step in this project, just against our own backend instead of a third-party gateway — this is a deliberate design choice (documented, not a missing feature), not a scope cut.

**`POST /orders` (checkout):** unchanged trigger, changed semantics. Validates stock, decrements `stock_quantity` (this now represents a *reservation*, not a final sale), clears the cart, creates the order as `status: PENDING, payment_status: PENDING`.

**`POST /orders/{id}/payment` (new — see API contract below):** simulates the gateway call.
- Body is `{cardNumber, expiry, cvv}`. **Never persisted** — validated for shape only (this is a simulation, not a real payment processor, so there's no PCI scope here).
- Card number is checked against a small hardcoded list of test "failure" cards (e.g. `4000000000000002` = declined, `4000000000000119` = processing error) — the same pattern Stripe/real sandboxes use for their own test cards. Anything else that passes a basic Luhn check succeeds.
- **On success:** `payment_status: PAID`, `status: CONFIRMED`. Stock stays decremented — sale is final.
- **On failure:** `payment_status: FAILED`, `status: CANCELLED`, and stock is **released back** (`stock_quantity += quantity` for every item on the order), using the same transactional row-level update pattern as the original decrement so there's no race condition on the release either. The cart is *not* restored — the customer re-adds items and checks out again. That mirrors real checkout UX (a declined card doesn't auto-restore your cart) and is a deliberate call, not a gap.
- Attempting to pay on an order that's already `CONFIRMED` or `CANCELLED` returns `409` — no double-pay, no retrying a dead order. A new order is required instead.

---

## 5. Auth Design

- Stateless JWT. No server-side sessions.
- On login: server validates credentials, issues a signed JWT containing `userId` and `role`, expiry ~24h.
- Client stores JWT (localStorage is fine for a class project) and sends it as `Authorization: Bearer <token>` on every request that needs auth.
- Spring Security filter chain validates the token and populates the `SecurityContext` — role checks happen via `@PreAuthorize("hasRole('ADMIN')")` or security config, **not** manual `if` checks in controller methods.
- Passwords hashed with BCrypt, never stored or logged in plaintext.

---

## 6. API Contract

Base path: `/api`

Standard success envelope:
```json
{ "data": { ... }, "message": "optional" }
```
Standard error envelope:
```json
{ "error": "SHORT_CODE", "message": "human readable message" }
```
HTTP status codes used normally: 200, 201, 400, 401, 403, 404, 409, 500.

Pagination (for list endpoints): query params `?page=0&size=20`, response includes `content`, `totalElements`, `totalPages`, `page`, `size`.

### Auth
| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | /auth/register | none | `{name, email, password}` | 201, user (no password) |
| POST | /auth/login | none | `{email, password}` | 200, `{token, user}` |
| GET | /auth/me | JWT | — | 200, current user |

### Books
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /books | none | query: `page, size, search, categoryId, sort` |
| GET | /books/{id} | none | |
| POST | /books | ADMIN | create |
| PUT | /books/{id} | ADMIN | update |
| DELETE | /books/{id} | ADMIN | delete |
| GET | /books/{id}/download | USER | only for EBOOK/AUDIOBOOK format. Server checks the requesting user has a CONFIRMED (or DELIVERED) order containing this book, then streams the file. Returns 403 if not purchased. |

### Categories
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /categories | none | |
| POST | /categories | ADMIN | |

### Cart
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| GET | /cart | USER | — | current user's cart + computed total — exact shape below |
| POST | /cart/items | USER | `{bookId, quantity}` | adds or increments |
| PUT | /cart/items/{itemId} | USER | `{quantity}` | |
| DELETE | /cart/items/{itemId} | USER | — | |
| DELETE | /cart | USER | — | clear cart |

**`GET /cart` response shape (locked):**
```json
{
  "data": {
    "items": [
      {
        "id": 3,
        "book": {
          "id": 2,
          "title": "The Bhagavad Gita: A New Translation (2nd ed.)",
          "imageUrl": "https://example.com/gita.jpg",
          "price": 14.99
        },
        "quantity": 4,
        "subtotal": 59.96
      }
    ],
    "totalAmount": 59.96
  },
  "message": null
}
```
Each cart item nests a `book` summary object (`id`, `title`, `imageUrl`, `price`) rather than a flat `bookId`/`bookTitle` — this is what backs `CartItemResponse` + the internal `BookSummary` DTO (not a new entity, just a response-shaping class, so no schema change in section 3). `subtotal` is `price × quantity` per item; `totalAmount` is the sum of all subtotals. `POST/PUT/DELETE /cart/items` and `DELETE /cart` all return this same shape reflecting the cart's new state after the mutation.

### Orders
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | /orders | USER | `{shippingAddress}` | checkout from current cart, validates stock, **reserves** (decrements) it, clears cart. Order created as `status: PENDING, payment_status: PENDING` — not yet a final sale. |
| POST | /orders/{id}/payment | USER (own order only) | `{cardNumber, expiry, cvv}` | simulates a payment gateway call — see "Simulated Payment Flow" (4a) above. Returns 200 with the updated order on success or failure; 409 if the order isn't in a payable state. |
| GET | /orders | USER | — | logged-in user's own orders |
| GET | /orders/{id} | USER (own) / ADMIN (any) | — | |
| GET | /admin/orders | ADMIN | — | all orders, paginated |
| PUT | /admin/orders/{id}/status | ADMIN | `{status}` | |

### Reviews (stretch)
| Method | Path | Auth | Body |
|---|---|---|---|
| GET | /books/{id}/reviews | none | — |
| POST | /books/{id}/reviews | USER | `{rating, comment}` |

---

## 8. One-Week Backend Build Schedule

With a 1-week deadline, this is the realistic order — don't reorder it, don't skip ahead to admin/stretch stuff before core flows work end-to-end.

- **Day 1:** DB schema + entities (JPA) + Spring Security config + JWT filter + register/login endpoints working, testable in Postman.
- **Day 2:** Book entity CRUD (admin) + public book listing/search/filter/pagination. Add `format`/`file_url` fields now, don't retrofit later.
- **Day 3:** Cart endpoints (add/update/remove/view).
- **Day 4:** Checkout -> order creation (stock check + reserve/decrement), simulated payment endpoint (confirm/fail + stock release on failure), order history endpoint, admin order list + status update.
- **Day 5:** Digital download endpoint (the purchase-gated one, checks `status IN (CONFIRMED, DELIVERED)`) + full integration pass with frontend — this is the day things break, budget for it.
- **Day 6:** Bug fixes surfaced by frontend integration, edge cases (empty cart checkout, out-of-stock, invalid tokens).
- **Day 7:** Buffer. Demo run-through with the team, docs handoff, do not start new features this day.

If you're behind by day 4, cut in this order: reviews/wishlist (never build) -> sorting options -> polish on error messages. Do not cut auth, the download gating, the simulated payment flow, or the service/repository layering to save time — those are the parts most likely to get scrutinized.

## 9. Rules For Anyone Using an AI Coding Tool On This Project

See `ai_tool_instructions.md` — paste it as the first message before asking for any code. It exists specifically so the tool can't quietly swap out Spring Security, change the schema, or "simplify" the contract above.
