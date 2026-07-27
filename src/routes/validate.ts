import type { FastifyInstance } from "fastify";
import type { ValidateRequest } from "../types.js";
import { getDataset } from "../dataset.js";
import { validateCart } from "../validate.js";

export default async function (server: FastifyInstance): Promise<void> {
  server.post("/validate", {
    schema: {
      body: {
        type: "object",
        required: ["items"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["offerId", "quantity"],
              properties: {
                offerId: { type: "string" },
                quantity: { type: "integer", minimum: 0 },
              },
            },
          },
          voucherCode: { type: "string" },
        },
      },
    },
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60_000,
      },
    },
  }, async (request) => {
    const body = request.body as ValidateRequest;
    return validateCart(body, getDataset());
  });
}
