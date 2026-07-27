# Agents.todo.md — Remaining work

The build agent only orchestrates: implementation and verification are delegated
to subagents. `Agents.md` is the binding contract — subagents must read it first.
Conventional commits after each change.

## A. Quantity minimum = 1

Schema allows 0, logic rejects 0. Fix schema + tests + demo.

- [ ] `src/routes/validate.ts:20` — change `minimum: 0` → `minimum: 1`
- [ ] `test/validate.test.ts:89,93` — INVALID_QUANTITY test uses `quantity: 0`; must use negative/non-integer instead
- [ ] `client/demo.ts:203` — demo uses `quantity: 0` → change to e.g. `-1`
- [ ] Regenerate `openapi.yaml` after schema change

## B. Stock enum `NO | LITTLE | ALOT` (replaces raw number)

Public enum on Offer instead of numeric stock. Exposed via API so AI can reason about availability.

- [ ] Add `StockLevel = "NO" | "LITTLE" | "ALOT"` to `src/types.ts`
- [ ] Change `Offer.stock: number` → `Offer.stock: StockLevel`
- [ ] Update zod schema in `src/dataset.ts`
- [ ] Update `scripts/generate-data.mjs` — emit enum values (map: 0 → NO, 1–10 → LITTLE, >10 → ALOT)
- [ ] Update `src/validate.ts:48` — `quantity > entry.offer.stock` doesn't work with enum; need range-based logic
- [ ] Update `Agents.md` contract (types section)
- [ ] Update all tests referencing numeric stock
- [ ] Regenerate `openapi.yaml`

## C. Male/female clothing with different size systems

- [ ] Add `gender: "male" | "female" | "unisex"` to clothing Product attributes
- [ ] Male clothing sizes: S/M/L/XL/XXL
- [ ] Female clothing sizes: XS/S/M/L/XL
- [ ] Size system varies by product type (shoes use EU 38–46 regardless of gender)
- [ ] Update `scripts/generate-data.mjs` clothing generator
- [ ] Regenerate dataset

## D. OpenAPI spec must be regenerated

- [ ] After all above changes: `pnpm openapi` → commit updated `openapi.yaml`

## E. 8 missing test cases

- [ ] Empty cart (no items) → valid: true, empty shipments, null deliveryDays
- [ ] All items invalid → valid: false, no shipments
- [ ] Voucher on empty cart → minOrderValue not met
- [ ] Free shipping threshold NOT met → assert positive shippingCost
- [ ] GET /products with category filter
- [ ] GET /products with price range filter
- [ ] GET /products with combined filters (?q=&category=&minPrice=&maxPrice=)
- [ ] POST /validate with invalid body (missing items, missing offerId)

## F. Multi-vendor cart (documented, no code change needed)

The API already supports multiple vendors per cart — items are grouped into
separate shipments by `(vendorId, warehouseId)`. The AI can optimize for
cheapest price, fastest delivery, or fewest packages by picking different
offers for the same variant. Core design feature, not a gap.
