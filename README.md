# MarketLink — SRS-aligned MERN application

MarketLink is a full-stack local farmers-market pre-order platform built with React/Vite, Node.js/Express, MongoDB/Mongoose, and JWT authentication.

## Documentation

- [SRS traceability](docs/SRS-TRACEABILITY.md)
- [Architecture and flows](docs/ARCHITECTURE.md)
- [Database design](docs/DATABASE.md)
- [Test plan](docs/TEST-PLAN.md)
- [Backend API](backend/API.md)

## Project layout

- `frontend/` — React + Vite storefront, customer order flow, farmer dashboard, admin dashboard, OpenStreetMap market view
- `backend/` — Express REST API, Mongoose models, JWT auth, stock reservation, review/favorite persistence, admin reporting

## Run locally from VS Code

Open two VS Code integrated terminals.

### Terminal 1 — API

```bash
cd backend
copy .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run seed
npm run dev
```

For macOS/Linux use `cp .env.example .env`. Start MongoDB first, or set `MONGO_URI` to a reachable MongoDB deployment. The API runs at `http://localhost:5000` and its base path is `http://localhost:5000/api/v1`.

### Terminal 2 — frontend

```bash
cd frontend
copy .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev
```

The Vite app runs at `http://localhost:5173`. Keep `VITE_API_URL=http://localhost:5000/api/v1` unless the API is hosted elsewhere. The backend `CLIENT_URL` must match the exact frontend origin.

### Enable the OpenRouter AI assistant

Add these values to `backend/.env` (never commit a real API key):

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://localhost:5173
```

The AI endpoint requires a logged-in MarketLink account, is limited to 10 requests per user per minute, uses live product/market context, and returns only English or Roman English text.

### Demo accounts after seeding

- Admin: `admin@marketlink.test` / `Admin123!`
- Approved farmer: `farmer@marketlink.test` / `Farmer123!`
- Customer: `customer@marketlink.test` / `Customer123!`

Change demo passwords and `JWT_SECRET` before deployment.

## Implemented SRS capabilities

- Customer, farmer, and admin authentication with JWT persistence, role guards, account status checks, and farmer approval workflow.
- Customer registration/profile address, farmer stall profile, operating days, pickup windows, and market association fields.
- Live products, markets, farmers, inventory quantity, availability, backend-owned prices/totals, and stock reservation/restoration.
- Market search, schedule display, real OpenStreetMap embed with coordinates/marker, and Google Maps directions link.
- Customer cart and one-farmer/one-market checkout with date, pickup time slot, notes, pickup token, order timeline, cancellation, and pending-order modification.
- Backend-persisted product/farmer favorites for authenticated customers.
- Backend-persisted verified reviews after a completed order, farmer responses, and admin review removal.
- Farmer product create/update/archive, order status workflow, live order queue, profile persistence, review responses, and data-derived dashboard metrics.
- Admin farmer approval/suspension, customer activation/deactivation, market management, order oversight, product archive, review moderation, and aggregate reports.
- In-app toast/status feedback. Payment remains explicitly pay-at-pickup; no payment gateway was added.
- AI chatbot remains optional and mock, as allowed by the SRS scope.

## Important business rules

- A customer can review a product only after an order containing that product reaches `completed`.
- Each customer can submit one review per product.
- A checkout order must contain products belonging to the same farmer and market.
- Stock is reserved when an order is created and restored when a pending order is cancelled or a farmer cancels it.
- Customers can modify pickup date, pickup slot, and notes only while an order is `pending`.
- Farmers must be approved (`active`) before publishing products or processing orders.

## Validation performed

- All backend JavaScript files pass `node --check`.
- The complete frontend entrypoint passes esbuild JSX/CSS parsing.
- Run `npm run build` locally after `npm install` to produce the final Vite production bundle.
- Run `npm run test:integration` from the repository root for the isolated MongoDB-backed API suite.

See `backend/API.md` for the endpoint contract and `SRS-IMPLEMENTATION-CHECKLIST.md` for an evaluation/submission checklist.
