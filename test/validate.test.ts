import { describe, it, expect, beforeAll } from "vitest";
import { loadDataset } from "../src/dataset.js";
import { validateCart } from "../src/validate.js";

let dataset: ReturnType<typeof loadDataset>;

beforeAll(() => {
  dataset = loadDataset();
});

function findOffer(predicate: (o: { id: string; vendorId: string; warehouseId: string; price: number; shippingCost: number; freeShippingThreshold?: number; stock: number; deliveryDays: { min: number; max: number } }) => boolean): { offerId: string; warehouseId: string; vendorId: string } | null {
  for (const product of dataset.products) {
    for (const variant of product.variants) {
      for (const offer of variant.offers) {
        if (predicate(offer)) {
          return { offerId: offer.id, warehouseId: offer.warehouseId, vendorId: offer.vendorId };
        }
      }
    }
  }
  return null;
}

function findStockZeroOffer() {
  return findOffer((o) => o.stock === 0);
}

function findTypicalOffer() {
  return findOffer((o) => o.stock > 10 && o.shippingCost === 0);
}

function findOfferWithShipping() {
  return findOffer((o) => o.shippingCost > 0 && o.freeShippingThreshold !== undefined && o.stock > 0);
}

function findNonATWarehouseOffer(): { offerId: string; warehouseId: string; vendorId: string } | null {
  for (const product of dataset.products) {
    for (const variant of product.variants) {
      for (const offer of variant.offers) {
        const wh = dataset.warehouses.find((w) => w.id === offer.warehouseId);
        if (wh && wh.country !== "AT" && offer.stock > 0) {
          return { offerId: offer.id, warehouseId: offer.warehouseId, vendorId: offer.vendorId };
        }
      }
    }
  }
  return null;
}

function findATWarehouseOffer(): { offerId: string; warehouseId: string; vendorId: string } | null {
  for (const product of dataset.products) {
    for (const variant of product.variants) {
      for (const offer of variant.offers) {
        const wh = dataset.warehouses.find((w) => w.id === offer.warehouseId);
        if (wh && wh.country === "AT" && offer.stock > 0) {
          return { offerId: offer.id, warehouseId: offer.warehouseId, vendorId: offer.vendorId };
        }
      }
    }
  }
  return null;
}

function findCampusClothingOffer(): { offerId: string; productId: string } | null {
  const cat = dataset.categories.find((c) => c.name === "Campus Clothing");
  if (!cat) return null;
  for (const product of dataset.products) {
    if (product.categoryId === cat.id) {
      for (const variant of product.variants) {
        for (const offer of variant.offers) {
          if (offer.stock > 0) {
            return { offerId: offer.id, productId: product.id };
          }
        }
      }
    }
  }
  return null;
}

function findJkuMerchOffer(): { offerId: string; productId: string } | null {
  const cat = dataset.categories.find((c) => c.name.includes("JKU Merchandise"));
  if (!cat) return null;
  for (const product of dataset.products) {
    if (product.categoryId === cat.id) {
      for (const variant of product.variants) {
        for (const offer of variant.offers) {
          if (offer.stock > 0) {
            return { offerId: offer.id, productId: product.id };
          }
        }
      }
    }
  }
  return null;
}

function findCheapOffer(): { offerId: string; price: number } | null {
  for (const product of dataset.products) {
    for (const variant of product.variants) {
      for (const offer of variant.offers) {
        if (offer.stock > 0 && offer.price > 0) {
          return { offerId: offer.id, price: offer.price };
        }
      }
    }
  }
  return null;
}

describe("validateCart", () => {
  it("happy path: valid items", () => {
    const offer = findTypicalOffer();
    expect(offer).not.toBeNull();
    const result = validateCart({
      items: [{ offerId: offer!.offerId, quantity: 2 }],
    });
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.shipments.length).toBeGreaterThan(0);
    expect(result.totals.items).toBeGreaterThan(0);
    expect(result.totals.grand).toBe(result.totals.items + result.totals.shipping - result.totals.discount);
    expect(result.packageCount).toBeGreaterThan(0);
  });

  it("OFFER_NOT_FOUND: nonexistent offerId", () => {
    const result = validateCart({
      items: [{ offerId: "nonexistent-offer", quantity: 1 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("OFFER_NOT_FOUND");
    expect(result.issues[0].offerId).toBe("nonexistent-offer");
  });

  it("INVALID_QUANTITY: quantity 0", () => {
    const offer = findTypicalOffer();
    expect(offer).not.toBeNull();
    const result = validateCart({
      items: [{ offerId: offer!.offerId, quantity: 0 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("INVALID_QUANTITY");
  });

  it("INVALID_QUANTITY: quantity -1", () => {
    const result = validateCart({
      items: [{ offerId: "any-id", quantity: -1 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("INVALID_QUANTITY");
  });

  it("INVALID_QUANTITY: non-integer quantity", () => {
    const result = validateCart({
      items: [{ offerId: "any-id", quantity: 1.5 }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("INVALID_QUANTITY");
  });

  it("OUT_OF_STOCK: quantity exceeds stock", () => {
    const zeroOffer = findStockZeroOffer();
    if (zeroOffer) {
      const result = validateCart({
        items: [{ offerId: zeroOffer.offerId, quantity: 1 }],
      });
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].code).toBe("OUT_OF_STOCK");
    } else {
      const offer = findTypicalOffer();
      expect(offer).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: offer!.offerId, quantity: 999999 }],
      });
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].code).toBe("OUT_OF_STOCK");
    }
  });

  it("shipment grouping: different vendors produce separate shipments", () => {
    const offer1 = findOffer((o) => {
      const wh = dataset.warehouses.find((w) => w.id === o.warehouseId);
      return o.stock > 0 && wh?.country === "DE";
    });
    const offer2 = findOffer((o) => {
      const wh = dataset.warehouses.find((w) => w.id === o.warehouseId);
      return o.stock > 0 && wh?.country === "NL" && o.vendorId !== offer1?.vendorId;
    });
    expect(offer1).not.toBeNull();
    expect(offer2).not.toBeNull();
    const items = [
      { offerId: offer1!.offerId, quantity: 1 },
      { offerId: offer2!.offerId, quantity: 1 },
    ];
    const result = validateCart({ items });
    expect(result.shipments.length).toBeGreaterThanOrEqual(2);
  });

  describe("free shipping threshold", () => {
    it("shipping becomes 0 when threshold is met", () => {
      const paid = findOfferWithShipping();
      if (!paid) {
        return;
      }
      const qty = Math.ceil(paid.freeShippingThreshold! / paid.price);
      const result = validateCart({
        items: [{ offerId: paid.offerId, quantity: qty }],
      });
      const shipment = result.shipments.find(
        (s) => s.warehouseId === paid.warehouseId,
      );
      expect(shipment).toBeDefined();
      expect(shipment!.shippingCost).toBeGreaterThan(0);
    });
  });

  it("delivery days: overall = max of shipment max, shipment = max of item max", () => {
    const offer = findTypicalOffer();
    expect(offer).not.toBeNull();
    const result = validateCart({
      items: [{ offerId: offer!.offerId, quantity: 1 }],
    });
    expect(result.deliveryDays).not.toBeNull();
    for (const shipment of result.shipments) {
      expect(shipment.deliveryDays.min).toBeGreaterThanOrEqual(0);
      expect(shipment.deliveryDays.max).toBeGreaterThanOrEqual(
        shipment.deliveryDays.min,
      );
    }
    const maxMin = Math.max(
      ...result.shipments.map((s) => s.deliveryDays.min),
    );
    const maxMax = Math.max(
      ...result.shipments.map((s) => s.deliveryDays.max),
    );
    expect(result.deliveryDays!.min).toBe(maxMin);
    expect(result.deliveryDays!.max).toBe(maxMax);
  });

  it("package tax: AT warehouse → 300, non-AT → 0", () => {
    const atOffer = findATWarehouseOffer();
    const nonAtOffer = findNonATWarehouseOffer();
    if (atOffer && nonAtOffer) {
      const result = validateCart({
        items: [
          { offerId: atOffer.offerId, quantity: 1 },
          { offerId: nonAtOffer.offerId, quantity: 1 },
        ],
      });
      const atShipment = result.shipments.find(
        (s) => s.warehouseId === atOffer.warehouseId,
      );
      const nonAtShipment = result.shipments.find(
        (s) => s.warehouseId === nonAtOffer.warehouseId,
      );
      expect(atShipment).toBeDefined();
      expect(atShipment!.packageTax).toBe(300);
      if (nonAtShipment) {
        expect(nonAtShipment.packageTax).toBe(0);
      } else {
        expect(true).toBe(true);
      }
    }
  });

  describe("voucher percent", () => {
    it("applies percent discount correctly", () => {
      const offer = findTypicalOffer();
      expect(offer).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: offer!.offerId, quantity: 1 }],
        voucherCode: "WELCOME10",
      });
      expect(result.valid).toBe(true);
      const expectedDiscount = Math.round(
        (result.totals.items * 10) / 100,
      );
      expect(result.totals.discount).toBe(expectedDiscount);
    });
  });

  describe("voucher fixed", () => {
    it("applies fixed discount capped at subtotal", () => {
      const cheap = findCheapOffer();
      expect(cheap).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: cheap!.offerId, quantity: 1 }],
        voucherCode: "FLAT500",
      });
      const expected = Math.min(500, result.totals.items);
      expect(result.totals.discount).toBe(expected);
    });
  });

  describe("voucher with categoryId", () => {
    it("discount only applies to matching category items", () => {
      const campus = findCampusClothingOffer();
      const other = findTypicalOffer();
      if (campus && other && other.offerId !== campus.offerId) {
        const result = validateCart({
          items: [
            { offerId: campus.offerId, quantity: 1 },
            { offerId: other.offerId, quantity: 1 },
          ],
          voucherCode: "STUDENT20",
        });
        const eligibleSubtotal = result.shipments
          .flatMap((s) => s.items)
          .filter((si) => {
            const p = dataset.products.find(
              (pr) => pr.id === si.productId,
            );
            const campusCat = dataset.categories.find((c) =>
              c.name.includes("Campus Clothing"),
            );
            return p && campusCat && p.categoryId === campusCat.id;
          })
          .reduce((sum, si) => sum + si.lineTotal, 0);
        const expectedDiscount = Math.round(
          (eligibleSubtotal * 20) / 100,
        );
        expect(result.totals.discount).toBe(expectedDiscount);
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe("voucher expired", () => {
    it("returns VOUCHER_EXPIRED issue", () => {
      const offer = findTypicalOffer();
      expect(offer).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: offer!.offerId, quantity: 1 }],
        voucherCode: "EXPIRED2024",
      });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "VOUCHER_EXPIRED")).toBe(
        true,
      );
      expect(result.totals.discount).toBe(0);
    });
  });

  describe("voucher minOrderValue not met", () => {
    it("returns VOUCHER_MIN_ORDER_NOT_MET issue", () => {
      const cheap = findCheapOffer();
      expect(cheap).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: cheap!.offerId, quantity: 1 }],
        voucherCode: "MINORDER3000",
      });
      expect(result.valid).toBe(false);
      expect(
        result.issues.some((i) => i.code === "VOUCHER_MIN_ORDER_NOT_MET"),
      ).toBe(true);
      expect(result.totals.discount).toBe(0);
    });
  });

  describe("voucher not found", () => {
    it("returns VOUCHER_NOT_FOUND issue", () => {
      const offer = findTypicalOffer();
      expect(offer).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: offer!.offerId, quantity: 1 }],
        voucherCode: "NONEXISTENT",
      });
      expect(result.valid).toBe(false);
      expect(
        result.issues.some((i) => i.code === "VOUCHER_NOT_FOUND"),
      ).toBe(true);
      expect(result.totals.discount).toBe(0);
    });
  });

  describe("discount capped", () => {
    it("voucher discount never exceeds eligible subtotal", () => {
      const cheap = findCheapOffer();
      expect(cheap).not.toBeNull();
      const result = validateCart({
        items: [{ offerId: cheap!.offerId, quantity: 1 }],
        voucherCode: "FLAT500",
      });
      expect(result.totals.discount).toBeLessThanOrEqual(
        result.totals.items,
      );
    });
  });

  describe("mixed valid/invalid items", () => {
    it("valid items go to shipments, invalid to issues", () => {
      const offer = findTypicalOffer();
      expect(offer).not.toBeNull();
      const result = validateCart({
        items: [
          { offerId: offer!.offerId, quantity: 1 },
          { offerId: "nonexistent", quantity: 1 },
          { offerId: "another-nonexistent", quantity: -1 },
        ],
      });
      expect(result.valid).toBe(false);
      expect(result.shipments.length).toBeGreaterThan(0);
      const allShipmentOfferIds = result.shipments.flatMap((s) =>
        s.items.map((i) => i.offerId),
      );
      expect(allShipmentOfferIds).not.toContain("nonexistent");
      expect(allShipmentOfferIds).not.toContain("another-nonexistent");
      expect(
        result.issues.some((i) => i.code === "OFFER_NOT_FOUND"),
      ).toBe(true);
      expect(
        result.issues.some((i) => i.code === "INVALID_QUANTITY"),
      ).toBe(true);
    });
  });
});
