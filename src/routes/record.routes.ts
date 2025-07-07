import z from "zod";

import { FastifyTypedInstance } from "@/types";
import { makeRecordController } from "@/module/record/factories/record-controller.factory";
import { createSchema, findAllSchema } from "@/module/record/record.schemas";

export default async function recordRoutes(app: FastifyTypedInstance) {
  const recordController = makeRecordController();

  app.post(
    "/",
    {
      schema: {
        operationId: "create",
        description: "Create a new record",
        tags: ["Record"],
        body: createSchema,
        response: {
          201: z.object({ message: z.string() }),
        },
      },
    },
    recordController.create
  );

  app.get(
    "/",
    {
      schema: {
        operationId: "findAll",
        description: "List records with optional filters",
        tags: ["Record"],
        querystring: findAllSchema,
        response: {
          200: z.object({
            data: z.array(
              z.object({
                id: z.string().uuid(),
                type: z.enum(["start", "end"]),
                userId: z.string().uuid(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
              })
            ),
            total: z.number(),
            nextOffset: z.number().nullable(),
            hasMore: z.boolean(),
          }),
        },
      },
    },
    recordController.findAll
  );
}
