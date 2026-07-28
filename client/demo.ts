const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function getJSON(path: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json() as Promise<unknown>;
}

async function postJSON(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
}

function divider() {
  console.log("─".repeat(60));
}

function heading(title: string) {
  console.log();
  divider();
  console.log(`  ${title}`);
  divider();
}

function formatCents(c: number): string {
  return `€${(c / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Step 1 – List categories
// ---------------------------------------------------------------------------
async function step1() {
  heading("1. List Categories — GET /categories");
  try {
    const cats = (await getJSON("/categories")) as { name: string; id: string }[];
    for (const c of cats) {
      console.log(`  ${c.name}`);
    }
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 2 – Search products for "laptop"
// ---------------------------------------------------------------------------
async function step2(): Promise<string | undefined> {
  heading('2. Search Products — GET /products?q=laptop');
  try {
    const products = (await getJSON("/products?q=laptop")) as {
      id: string; name: string; variants: { offers: { price: number }[] }[];
    }[];
    const top5 = products.slice(0, 5);
    for (const p of top5) {
      const prices = p.variants.flatMap((v) => v.offers.map((o) => o.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      console.log(`  ${p.name}`);
      console.log(`    Price range: ${formatCents(min)} – ${formatCents(max)}`);
    }
    return top5[0]?.id;
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 3 – Product detail (first result from step 2)
// ---------------------------------------------------------------------------
async function step3(productId: string | undefined) {
  heading("3. Product Details — GET /products/:id");
  if (!productId) {
    console.log("  SKIP (no product ID from step 2)");
    return;
  }
  try {
    const p = (await getJSON(`/products/${productId}`)) as {
      id: string; name: string; description: string; brand?: string; tags: string[];
      variants: {
        id: string; name: string; sku: string;
        offers: {
          id: string; vendorId: string; warehouseId: string;
          price: number; shippingCost: number;
          freeShippingThreshold?: number;
          deliveryDays: { min: number; max: number }; stock: string;
        }[];
      }[];
    };
    console.log(`  ${p.name}`);
    console.log(`  Brand: ${p.brand ?? "—"}`);
    console.log(`  ${p.description}`);
    for (const v of p.variants) {
      console.log(`\n  Variant: ${v.name} (${v.sku})`);
      for (const o of v.offers) {
        const ship = o.shippingCost === 0 ? "free" : formatCents(o.shippingCost);
        const threshold = o.freeShippingThreshold != null
          ? ` (free ≥ ${formatCents(o.freeShippingThreshold)})`
          : "";
        console.log(
          `    Offer ${o.id.slice(0, 27)}… | vendor=${o.vendorId.slice(0, 27)}… | ` +
          `${formatCents(o.price)} | shipping ${ship}${threshold} | ` +
          `${o.deliveryDays.min}–${o.deliveryDays.max} d | stock ${o.stock}`,
        );
      }
    }
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 4 – Compare offers for one variant
// ---------------------------------------------------------------------------
async function step4() {
  heading("4. Compare Offers for a Variant");
  try {
    // Use the "Campus Clothing – Urban Jacket" or similar product with multiple
    // offers.  For deterministic behaviour we grab a known product that has
    // variants with several offers – the ThinkPad X1 Carbon Student Edition.
    const products = (await getJSON("/products?q=ThinkPad+X1+Carbon")) as {
      id: string; name: string;
      variants: {
        id: string; name: string; sku: string;
        offers: {
          id: string; vendorId: string; warehouseId: string;
          price: number; shippingCost: number;
          freeShippingThreshold?: number;
          deliveryDays: { min: number; max: number }; stock: string;
        }[];
      }[];
    }[];
    const tp = products[0];
    if (!tp) { console.log("  SKIP (ThinkPad not found)"); return; }

    const variant = tp.variants.find((v) => v.offers.length > 1);
    if (!variant) { console.log("  SKIP (no variant with multiple offers)"); return; }

    console.log(`  Product: ${tp.name}`);
    console.log(`  Variant: ${variant.name} (${variant.sku})`);

    for (let i = 0; i < variant.offers.length; i++) {
      const o = variant.offers[i];
      const ship = o.shippingCost === 0
        ? "free"
        : `${formatCents(o.shippingCost)}${o.freeShippingThreshold != null ? ` (free ≥ ${formatCents(o.freeShippingThreshold)})` : ""}`;
      console.log(`\n  ── Offer #${i + 1} ──`);
      console.log(`     Vendor:     ${o.vendorId}`);
      console.log(`     Warehouse:  ${o.warehouseId}`);
      console.log(`     Price:      ${formatCents(o.price)}`);
      console.log(`     Shipping:   ${ship}`);
      console.log(`     Delivery:   ${o.deliveryDays.min}–${o.deliveryDays.max} days`);
      console.log(`     Stock:      ${o.stock}`);
    }

    // Comparison summary
    console.log(`\n  ── Comparison ──`);
    const cheapest = variant.offers.reduce((a, b) => (a.price < b.price ? a : b));
    const fastest = variant.offers.reduce((a, b) =>
      a.deliveryDays.max < b.deliveryDays.max ? a : b,
    );

    // Group offers by (vendorId, warehouseId) to find which combo yields
    // fewest packages when items are consolidated.
    const groups = new Map<string, number>();
    for (const o of variant.offers) {
      const key = `${o.vendorId}|${o.warehouseId}`;
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    const maxShared = Math.max(...groups.values(), 1);
    const bestGroup = [...groups.entries()].find(([, count]) => count === maxShared)!;
    const [bestVendor, bestWarehouse] = bestGroup[0].split("|");

    console.log(`  Cheapest:         ${formatCents(cheapest.price)} (vendor ${cheapest.vendorId.slice(0, 27)}…)`);
    console.log(`  Fastest:          ${fastest.deliveryDays.max} days max (vendor ${fastest.vendorId.slice(0, 27)}…)`);
    console.log(
      `  Fewest packages: ${maxShared} offer(s) share vendor+warehouse ` +
      `(${bestVendor.slice(0, 27)}… | ${bestWarehouse.slice(0, 27)}…)`,
    );
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 5 – Validate a problematic cart
// ---------------------------------------------------------------------------
async function step5() {
  heading("5. Validate Cart — POST /validate (with errors)");
  try {
    const cart = {
      items: [
        { offerId: "off-00000000-0018-0000-000000000000", quantity: 1 },
        { offerId: "off-nonexistent", quantity: 1 },
        { offerId: "off-nonexistent-another", quantity: 1 },
      ],
    };
    const data = (await postJSON("/validate", cart)) as {
      valid: boolean; issues: { code: string; message: string; offerId?: string }[];
      shipments: unknown[]; totals: Record<string, number>;
      deliveryDays: { min: number; max: number } | null; packageCount: number;
    };
    console.log(`  valid: ${data.valid}`);
    console.log("  issues:");
    for (const iss of data.issues) {
      console.log(`    ${iss.code} — ${iss.message}${iss.offerId != null ? ` (offerId: ${iss.offerId})` : ""}`);
    }
    console.log(`  shipments (${data.shipments.length}):`);
    console.log(JSON.stringify(data.shipments, null, 2));
    console.log(`  totals:         ${JSON.stringify(data.totals)}`);
    console.log(`  deliveryDays:   ${JSON.stringify(data.deliveryDays)}`);
    console.log(`  packageCount:   ${data.packageCount}`);
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 6 – Validate with valid voucher WELCOME10
// ---------------------------------------------------------------------------
async function step6() {
  heading('6. Validate with Voucher — POST /validate (voucherCode: "WELCOME10")');
  try {
    const cart = {
      items: [
        { offerId: "off-00000000-0018-0000-000000000000", quantity: 1 },
        { offerId: "off-00000000-0030-0000-000000000000", quantity: 2 },
      ],
      voucherCode: "WELCOME10",
    };
    const data = (await postJSON("/validate", cart)) as {
      valid: boolean; issues: unknown[]; totals: Record<string, number>;
    };
    console.log(`  valid:     ${data.valid}`);
    console.log(`  issues:    ${JSON.stringify(data.issues)}`);
    console.log(
      `  totals:    items=${formatCents(data.totals.items)}  shipping=${formatCents(data.totals.shipping)}  ` +
      `discount=${formatCents(data.totals.discount)}  grand=${formatCents(data.totals.grand)}`,
    );
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Step 7 – Validate with expired voucher EXPIRED2024
// ---------------------------------------------------------------------------
async function step7() {
  heading('7. Validate with Expired Voucher — POST /validate (voucherCode: "EXPIRED2024")');
  try {
    const cart = {
      items: [
        { offerId: "off-00000000-0018-0000-000000000000", quantity: 1 },
        { offerId: "off-00000000-0030-0000-000000000000", quantity: 2 },
      ],
      voucherCode: "EXPIRED2024",
    };
    const data = (await postJSON("/validate", cart)) as {
      valid: boolean; issues: { code: string; message: string }[]; totals: Record<string, number>;
    };
    console.log(`  valid:  ${data.valid}`);
    console.log("  issues:");
    for (const iss of data.issues) {
      console.log(`    ${iss.code} — ${iss.message}`);
    }
    console.log(
      `  totals: items=${formatCents(data.totals.items)}  shipping=${formatCents(data.totals.shipping)}  ` +
      `discount=${formatCents(data.totals.discount)}  grand=${formatCents(data.totals.grand)}`,
    );
  } catch (err: unknown) {
    console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Webshop API Demo Client — BASE_URL=${BASE_URL}`);

  await step1();
  const firstProductId = await step2();
  await step3(firstProductId);
  await step4();
  await step5();
  await step6();
  await step7();

  heading("Done");
}

main();
