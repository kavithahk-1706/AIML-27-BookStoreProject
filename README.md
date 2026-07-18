# Ink in the Clouds 📚

A full-stack online bookstore supporting physical books, ebooks, and audiobooks — with purchase-gated digital delivery, simulated payment, and a full admin panel.

**Built for:** AIML-27 Full Stack Project | Mallareddy University
**Stack:** Spring Boot · React · MySQL

---

## Features

### User-facing
- Browse, search, and filter books by title, author, category, and format (Physical / Ebook / Audiobook)
- User registration and login with JWT-based auth
- Add to cart, adjust quantities (physical books only), and checkout
- Simulated payment flow — test card success/failure before order is finalized
- Purchase-gated digital delivery — ebooks and audiobooks unlock a Read/Listen button only after a confirmed payment
- Order history with full order detail view
- Profile management — update name, email, and password

### Admin
- Full CRUD on books (create, edit, delete) with format-aware fields (stock quantity hidden for digital, file URL hidden for physical)
- View all orders across all users and update order status

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Axios, Context API |
| Backend | Spring Boot, Spring Security, Spring Data JPA |
| Auth | JWT (stateless, no sessions), BCrypt password hashing |
| Database | MySQL |
| File Storage | Local filesystem (configurable path) |

---

## Project Structure

```
AIML-27-BookStoreProject/
├── backend/         # Spring Boot application
│   └── src/
│       └── main/java/com/bookstore/backend/
│           ├── controller/
│           ├── service/
│           ├── repository/
│           ├── entity/
│           ├── dto/
│           ├── security/
│           └── exception/
└── frontend/        # React application
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

---

## Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE bookstore_db;
```

### 2. Backend

Navigate to the `backend/` directory and configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

app.jwt.secret=YOUR_JWT_SECRET
app.jwt.expiration=86400000

app.file.storage-path=PATH_TO_STORE_DIGITAL_FILES
```

Then run:

```bash
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`.

### 3. Frontend

Navigate to the `frontend/` directory:

```bash
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`.

---

## API Overview

Base path: `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | none | Register a new user |
| POST | /auth/login | none | Login, returns JWT |
| GET | /auth/me | JWT | Get current user |
| PUT | /auth/me | JWT | Update profile / password |
| GET | /books | none | List books (search, filter, paginate) |
| GET | /books/:id | none | Get book detail |
| POST | /books | ADMIN | Create book |
| PUT | /books/:id | ADMIN | Update book |
| DELETE | /books/:id | ADMIN | Delete book |
| GET | /books/:id/download | USER | Stream/download digital book (purchase-gated) |
| GET | /books/:id/purchase-status | USER | Check if user has purchased a book |
| GET | /categories | none | List all categories |
| GET | /cart | USER | View cart |
| POST | /cart/items | USER | Add item to cart |
| PUT | /cart/items/:id | USER | Update item quantity |
| DELETE | /cart/items/:id | USER | Remove item |
| POST | /orders | USER | Checkout (creates order, reserves stock) |
| POST | /orders/:id/payment | USER | Simulate payment (confirm or fail) |
| GET | /orders | USER | Order history |
| GET | /orders/:id | USER/ADMIN | Order detail |
| GET | /admin/orders | ADMIN | All orders |
| PUT | /admin/orders/:id/status | ADMIN | Update order status |

Full API contract: [`backend_architecture_and_api_contract.md`](./backend_architecture_and_api_contract.md)

---

## Key Design Decisions

**Stateless JWT auth** — no server-side sessions; scales cleanly and simplifies the security filter chain.

**Simulated payment** — a self-contained `/orders/{id}/payment` endpoint that validates card shape and checks against hardcoded failure cards (same pattern as Stripe's test sandbox). No real money, no third-party API, no PCI scope. Stock is reserved at checkout and released back on payment failure.

**Digital item quantity rules** — ebooks and audiobooks are licenses, not inventory. Quantity is always locked to 1, stock is never checked or decremented, and the download endpoint is gated on a confirmed order rather than stock.

**Service layer pattern** — every service is an interface + implementation class (`BookService` / `BookServiceImpl`). Controllers depend on the interface, making the business logic independently testable.

**Purchase-gated download** — `GET /books/{id}/download` checks `OrderItemRepository` for a CONFIRMED or DELIVERED order containing the book before streaming the file. The file path is never exposed as a public URL.

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | admin123 |
| User | (register via /register) | — |

---

## Team

| Name | Role |
|---|---|
| (Backend developer name) | Backend — Spring Boot, Security, API, DB |
| (Frontend developer name) | Frontend — React, UI, Cart, Checkout |
| (Docs/testing name) | Documentation, Testing |

> Replace the placeholders above with your actual team names before submission.

---

## Future Scope

- Reviews and ratings on books
- Wishlist
- Real payment gateway integration (Razorpay / Stripe)
- Book recommendations based on purchase history
- Account deletion
- COD support