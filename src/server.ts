import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import rateLimit from "@fastify/rate-limit";
import { loadDataset } from "./dataset.js";
import healthRoute from "./routes/health.js";
import categoriesRoute from "./routes/categories.js";
import productsRoute from "./routes/products.js";
import vendorsRoute from "./routes/vendors.js";
import warehousesRoute from "./routes/warehouses.js";
import validateRoute from "./routes/validate.js";

export async function buildServer(): Promise<FastifyInstance> {
  loadDataset();

  const server = Fastify({ logger: false });

  await server.register(swagger, {
    openapi: {
      info: {
        title: "Webshop Backend API",
        version: "1.0.0",
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: "/docs",
  });

  await server.register(rateLimit, { global: false });

  await server.register(healthRoute);
  await server.register(categoriesRoute);
  await server.register(productsRoute);
  await server.register(vendorsRoute);
  await server.register(warehousesRoute);
  await server.register(validateRoute);

  return server;
}
