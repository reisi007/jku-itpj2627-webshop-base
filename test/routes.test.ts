import { describe, it, expect, afterEach } from "vitest";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

describe("routes", () => {
  let server: FastifyInstance;

  afterEach(async () => {
    await server.close();
  });

  it("GET /health returns 200", async () => {
    server = await buildServer();
    const res = await server.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("GET /categories returns 200", async () => {
    server = await buildServer();
    const res = await server.inject({ method: "GET", url: "/categories" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("name");
    expect(body[0]).toHaveProperty("description");
  });

  it("GET /categories/:id/products with valid category returns 200", async () => {
    server = await buildServer();
    const catRes = await server.inject({
      method: "GET",
      url: "/categories",
    });
    const categories = catRes.json();
    const id = categories[0].id;
    const res = await server.inject({
      method: "GET",
      url: `/categories/${id}/products`,
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    for (const p of body) {
      expect(p.categoryId).toBe(id);
    }
  });

  it("GET /categories/:id/products with invalid id returns 404", async () => {
    server = await buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/categories/nonexistent/products",
    });
    expect(res.statusCode).toBe(404);
  });

  it("GET /products returns 200", async () => {
    server = await buildServer();
    const res = await server.inject({ method: "GET", url: "/products" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /products?q=<term> filters results", async () => {
    server = await buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/products?q=thinkpad",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const p of body) {
      const haystack = [
        p.name,
        p.description,
        p.brand ?? "",
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      expect(haystack.includes("thinkpad")).toBe(true);
    }
  });

  it("GET /products/:id with valid id returns 200", async () => {
    server = await buildServer();
    const listRes = await server.inject({
      method: "GET",
      url: "/products",
    });
    const products = listRes.json();
    const id = products[0].id;
    const res = await server.inject({
      method: "GET",
      url: `/products/${id}`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("id", id);
  });

  it("GET /products/:id with invalid id returns 404", async () => {
    server = await buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/products/nonexistent",
    });
    expect(res.statusCode).toBe(404);
  });

  it("GET /vendors returns 200", async () => {
    server = await buildServer();
    const res = await server.inject({ method: "GET", url: "/vendors" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("GET /vendors/:id with valid id returns 200", async () => {
    server = await buildServer();
    const listRes = await server.inject({
      method: "GET",
      url: "/vendors",
    });
    const vendors = listRes.json();
    const id = vendors[0].id;
    const res = await server.inject({
      method: "GET",
      url: `/vendors/${id}`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("id", id);
  });

  it("GET /vendors/:id with invalid id returns 404", async () => {
    server = await buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/vendors/nonexistent",
    });
    expect(res.statusCode).toBe(404);
  });

  it("GET /warehouses returns 200", async () => {
    server = await buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/warehouses",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const w of body) {
      expect(w).toHaveProperty("packageTax");
    }
  });

  it("GET /vouchers returns 404", async () => {
    server = await buildServer();
    const res = await server.inject({ method: "GET", url: "/vouchers" });
    expect(res.statusCode).toBe(404);
  });

  it("POST /validate with valid body returns 200", async () => {
    server = await buildServer();
    const prodRes = await server.inject({
      method: "GET",
      url: "/products",
    });
    const products = prodRes.json();
    const offerId = products[0].variants[0].offers[0].id;
    const res = await server.inject({
      method: "POST",
      url: "/validate",
      body: { items: [{ offerId, quantity: 1 }] },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("valid");
    expect(body).toHaveProperty("issues");
    expect(body).toHaveProperty("shipments");
    expect(body).toHaveProperty("totals");
    expect(body).toHaveProperty("deliveryDays");
    expect(body).toHaveProperty("packageCount");
  });
});
