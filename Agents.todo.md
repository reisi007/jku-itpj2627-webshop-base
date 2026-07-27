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

- [ ] **Quantity minimum should be 1** — `src/routes/validate.ts:20` has `minimum: 0`, needs `minimum: 1`.
      `test/validate.test.ts` uses quantity 0, `client/demo.ts` uses quantity 0.
      After changing: regenerate `openapi.yaml` (committed version shows `minimum: 1` but
      source has `minimum: 0` — it's out of sync).

- [ ] **Male and female clothing with different size systems** in `scripts/generate-data.mjs`:
      - Male-coded products: S/M/L/XL/XXL
      - Female-coded products: XS/S/M/L/XL
      - Add `gender` attribute to clothing items (`male`/`female`/`unisex`) to select
        the right size pool per product

- [ ] **8 missing test cases** (all absent from both `test/routes.test.ts` and
      `test/validate.test.ts`):
      - `validateCart`: empty cart, all items invalid, voucher on empty cart,
        free shipping threshold NOT met (positive shippingCost)
      - `routes`: GET /products with category filter, price range filter,
        combined filters, POST /validate with invalid body
