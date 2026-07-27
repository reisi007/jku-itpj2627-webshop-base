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

## Wave 3 — Verification (subagent) + finish (build agent)

- [ ] Run `npm run typecheck` && `npm test` — fix all failures
- [ ] Generate `openapi.yaml` (`npm run openapi`), verify spec covers all routes
- [ ] E2E smoke: start server, run `npm run client` against it, verify output
- [ ] `README.md` — quickstart, env vars, dataset swap, API overview
- [ ] Commit: `chore: verify build, generate openapi spec and add readme`
