# Bookstore Project — Documentation & Presentation Plan

## Report / Documentation Sections

1. **Problem Statement & Objective** — why an online bookstore, what problem it solves (manual inventory/order tracking, no centralized catalog, etc.)
2. **Tech Stack & Justification** — Spring Boot (backend, mature ecosystem, Spring Security for auth), React (component-based UI, large ecosystem), MySQL (relational data fits orders/inventory well)
3. **System Architecture Diagram** — 3-tier: React frontend <-> Spring Boot REST API <-> MySQL. (Ask backend person for the diagram in `backend_architecture_and_api_contract.md` section 2 — just needs to be redrawn as a proper figure.)
4. **ER Diagram** — from the schema in `backend_architecture_and_api_contract.md` section 3 (users, categories, books, cart_items, orders, order_items, + reviews/wishlist if built)
5. **Feature List** — MVP features implemented, and stretch features if completed
6. **API Documentation** — table of endpoints (can literally reuse the table from section 6 of the backend doc, don't redo the work)
7. **Screenshots / UI Walkthrough** — one screenshot per major page (catalog, book detail, cart, checkout, order history, admin panel)
8. **Individual Contributions** — who did backend, who did frontend, who did docs/testing
9. **Challenges Faced & Solutions** — good place to mention any real bugs solved (stock validation on checkout, JWT expiry handling, etc.)
10. **Future Scope** — reviews, wishlist, payment gateway integration, recommendation system, etc.

## Presentation / Demo Flow (suggested order)

1. Problem statement (30 sec)
2. Architecture diagram (1 min) — show the 3-tier flow
3. Live demo, in this order:
   - Register/login as a normal user
   - Browse catalog, search/filter
   - Add to cart, view cart
   - Checkout -> show order created
   - View order history
   - Log in as admin, show book CRUD
   - Show admin updating an order's status
4. Brief look at the API contract / DB schema (1-2 slides, don't read every row aloud — highlight the interesting ones like cart and checkout)
5. Challenges + what you'd add next
6. Questions

## Likely Viva/Q&A Questions to Prepare For

- "Why JWT instead of sessions?" -> stateless, scales better, no server-side session storage needed
- "How do you prevent a normal user from hitting admin endpoints?" -> Spring Security role-based access control (`@PreAuthorize`/security config), enforced server-side regardless of what the frontend hides
- "What happens if two people try to buy the last copy of a book at the same time?" -> stock check happens at order-creation time in the service layer before decrementing; explain what your actual implementation does here
- "Why MySQL and not a NoSQL database?" -> data is relational (orders reference users and books, referential integrity matters)
- "How is the password stored?" -> BCrypt hash, never plaintext

## Notes
- Pull the DB schema and API table directly from `backend_architecture_and_api_contract.md` — don't recreate it by hand and risk it drifting out of sync with what's actually built.
- If features get cut from the stretch list, cut them from the report too — don't document features that don't exist in the actual app.
