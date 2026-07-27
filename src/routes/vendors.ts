import type { FastifyInstance } from "fastify";
import { getDataset, getVendorById } from "../dataset.js";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/vendors", async () => {
    return getDataset().vendors;
  });

  server.get<{ Params: { id: string } }>("/vendors/:id", {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
    },
  }, async (request, reply) => {
    const vendor = getVendorById().get(request.params.id);
    if (!vendor) {
      reply.code(404);
      return { statusCode: 404, error: "Not Found", message: "Vendor not found" };
    }
    return vendor;
  });
}
