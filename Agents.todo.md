# Agents.todo.md — Build plan (orchestrated via subagents)

The build agent only orchestrates: implementation and verification are delegated
to subagents. `Agents.md` is the binding contract (types, API shape, rules) —
subagents must read it first. Conventional commit after each wave.

## Wave 0 — Docs (build agent)

- [x] Write `Agents.md` (contract: stack, structure, API, types, /validate rules)
- [x] Write `Agents.todo.md` (this file)
- [x] Vouchers must NOT be queryable via API; only rate-limited `POST /validate`
- [x] Commit: `docs: add agent contract and build plan` ✓ a7e5e84

## Wave 1 — Foundation (delegated, completed)

- [x] Scaffold: package.json (ESM), tsconfig.json (strict), .gitignore, npm install
- [x] Upgrade ALL deps to latest: Fastify 5.10, zod 4.4, TypeScript 7, vitest 4, etc. ✓ a3f6a74
- [x] `src/types.ts` — all domain + API types from Agents.md
- [x] `src/dataset.ts` — zod 4 schemas, loadDataset(), 6 lookup indexes
- [x] `data/dataset.json` — 201 products, 1765 offers (84% free shipping), JKU-Linz theme
- [x] `scripts/generate-data.mjs` — dataset generator (do not hand-edit dataset.json)
- [x] Modeled: per-vendor shipping, freeShippingThreshold, Warehouse.packageTax (AT €3)
- [x] Commit: ✓ a7e5e84 (docs), a3f6a74 (chore: deps), c57db79 (feat: dataset+types)

## Wave 2 — Parallel implementation (3 subagents, launching now)

### 2a — API + validate + OpenAPI

- [ ] `src/validate.ts` — pure cart validation per Agents.md rules
- [ ] `src/server.ts` — `buildServer()`: swagger, swagger-ui, rate limit on
      /validate only (5/min/IP), routes with JSON schemas
- [ ] `src/routes/*.ts` — health, categories, products, vendors, warehouses, validate
      (NO voucher endpoints)
- [ ] `src/index.ts` — env (PORT, HOST, DATASET_PATH), start
- [ ] `scripts/openapi.ts` — write `openapi.yaml`
- [ ] Commit: `feat: fastify server, routes, cart validation and openapi export`

### 2b — CLI demo client

- [ ] `client/demo.ts` — plain fetch against BASE_URL (default localhost:3000):
      list categories → search products → compare offers of one variant
      (cheapest vs fastest vs fewest packages) → POST /validate with voucher
      → print totals/shipments table
- [ ] Commit: `feat: cli demo client showcasing catalog and validate flow`

### 2c — Tests (vitest)

- [ ] `test/dataset.test.ts` — dataset loads, zod-valid, referential integrity
- [ ] `test/routes.test.ts` — all GET endpoints incl. 404s and product filters;
      assert no voucher route exists (404)
- [ ] `test/validate.test.ts` — unit tests for pure logic: grouping, free
      shipping threshold, delivery days aggregation, all issue codes, voucher
      types (percent/fixed/minOrder/expired/category-bound), discount cap
- [ ] `test/ratelimit.test.ts` — 6th request within a minute → 429
- [ ] Commit: `test: dataset, routes, validate logic and rate limit suites`

## Wave 3 — Verification + polish (completed)

- [x] Independent verification: test coverage, implementation completeness, no missing endpoints ✓
- [x] E2E smoke: server start, client demo, all 7 steps pass ✓
- [x] README.md — prerequisites, installation, commands, dataset swap, API overview ✓
- [x] Dataset realism improved: pricing separated, stock distribution, shoe sizes ✓
- [x] Commit: `docs: add project README`, `fix: improve dataset realism`

## Remaining (TODO)

### A. Quantity minimum = 1

Schema allows 0, logic rejects 0. Fix schema + tests + demo.

- [ ] `src/routes/validate.ts:20` — change `minimum: 0` → `minimum: 1`
- [ ] `test/validate.test.ts:89,93` — INVALID_QUANTITY test uses `quantity: 0`; must use negative/non-integer instead
- [ ] `client/demo.ts:203` — demo uses `quantity: 0` → change to e.g. `-1`
- [ ] Regenerate `openapi.yaml` after schema change

### B. Stock enum `NO | LITTLE | ALOT` (replaces raw number)

Public enum on Offer instead of numeric stock. Exposed via API so AI can reason about availability.

- [ ] Add `StockLevel = "NO" | "LITTLE" | "ALOT"` to `src/types.ts`
- [ ] Change `Offer.stock: number` → `Offer.stock: StockLevel`
- [ ] Update zod schema in `src/dataset.ts`
- [ ] Update `scripts/generate-data.mjs` — emit enum values (map: 0 → NO, 1–10 → LITTLE, >10 → ALOT)
- [ ] Update `src/validate.ts:48` — `quantity > entry.offer.stock` doesn't work with enum; need range-based logic
- [ ] Update `Agents.md` contract (types section)
- [ ] Update all tests referencing numeric stock
- [ ] Regenerate `openapi.yaml`

### C. Male/female clothing with different size systems

- [ ] Add `gender: "male" | "female" | "unisex"` to clothing Product attributes
- [ ] Male clothing sizes: S/M/L/XL/XXL
- [ ] Female clothing sizes: XS/S/M/L/XL
- [ ] Size system varies by product type (shoes use EU 38–46 regardless of gender)
- [ ] Update `scripts/generate-data.mjs` clothing generator
- [ ] Regenerate dataset

### D. OpenAPI spec must be regenerated

- [ ] After all above changes: `pnpm openapi` → commit updated `openapi.yaml`

### E. 8 missing test cases

- [ ] Empty cart (no items) → valid: true, empty shipments, null deliveryDays
- [ ] All items invalid → valid: false, no shipments
- [ ] Voucher on empty cart → minOrderValue not met
- [ ] Free shipping threshold NOT met → assert positive shippingCost
- [ ] GET /products with category filter
- [ ] GET /products with price range filter
- [ ] GET /products with combined filters (?q=&category=&minPrice=&maxPrice=)
- [ ] POST /validate with invalid body (missing items, missing offerId)

### F. Multi-vendor cart (documented, no code change needed)

The API already supports multiple vendors per cart — items are grouped into
separate shipments by `(vendorId, warehouseId)`. The AI can optimize for
cheapest price, fastest delivery, or fewest packages by picking different
offers for the same variant. Core design feature, not a gap.
