import type { FastifyInstance } from "fastify";
import { getDataset } from "../dataset.js";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/warehouses", async () => {
    return getDataset().warehouses;
  });
}
