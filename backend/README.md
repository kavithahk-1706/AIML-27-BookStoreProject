# Bookstore Backend — Day 1 (Auth + Security + Entities)

## What's here
Full entity set (User, Category, Book, CartItem, Order, OrderItem) matching the DB schema in the plan doc, Spring Security + JWT wired up end to end, and working `/api/auth/register`, `/api/auth/login`, `/api/auth/me` endpoints.

Only auth is wired to a controller so far — the other entities/repositories exist and are ready for Day 2 onward (books, cart, orders).

## Setup

1. **Install MySQL** if you don't have it, and create the database:
   ```sql
   CREATE DATABASE bookstore;
   ```

2. **Edit `src/main/resources/application.properties`:**
   - Set `spring.datasource.username` / `spring.datasource.password` to your actual MySQL credentials.
   - Replace `app.jwt.secret` with a real random string. Generate one with:
     ```
     openssl rand -base64 32
     ```
     (or any random 32+ character string works for dev purposes)

3. **Run it:**
   - Easiest: open the `bookstore-backend` folder in IntelliJ (or your IDE of choice) as a Maven project and run `BackendApplication.java` directly — it'll handle Maven for you.
   - From command line, if you have Maven installed: `mvn spring-boot:run`
   - (There's no `mvnw` wrapper included here — if you want one, run `mvn -N wrapper:wrapper` once inside the project folder and it'll generate it.)

   On first run, Hibernate will auto-create all the tables (`spring.jpa.hibernate.ddl-auto=update`) based on the entities. Check your MySQL client afterward — you should see `users`, `categories`, `books`, `cart_items`, `orders`, `order_items` tables.

4. **App runs on** `http://localhost:8080`

## Testing in Postman

### Register
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "Kavitha Kidambi",
  "email": "kavitha@test.com",
  "password": "test1234"
}
```
Expected: `201 Created`, body has `data.id`, `data.name`, `data.email`, `data.role` (will be `USER`).

### Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "kavitha@test.com",
  "password": "test1234"
}
```
Expected: `200 OK`, body has `data.token` and `data.user`. **Copy the token** for the next step.

### Get current user (protected endpoint)
```
GET http://localhost:8080/api/auth/me
Authorization: Bearer <paste the token here>
```
Expected: `200 OK`, returns your user info.

Try it **without** the Authorization header too — you should get a `403`, confirming the security config is actually blocking unauthenticated requests.

### Make yourself an admin (for testing admin-only endpoints later)
There's no "become admin" endpoint on purpose — that would be a massive security hole. For now, just update it directly in MySQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'kavitha@test.com';
```
You'll need to log in again after this to get a fresh token (the role is baked into what the token authenticates against, not the token itself, but do it anyway to be safe).

## What's next (Day 2 per the plan)
- `BookController` + `BookService`/`BookServiceImpl` — CRUD for admin, public list/search/filter for everyone
- `CategoryController`
- Wire the `format`/`fileUrl` fields into the book creation flow

## A note on the `role` claim
Right now the JWT only encodes the user's email (`subject`). Role is looked up fresh from the DB on every request via `CustomUserDetailsService`. This is intentional — it means if you change someone's role in the DB, it takes effect on their very next request instead of only after their old token expires. Slightly more DB hits, much safer for a project where you'll be testing role changes constantly.
