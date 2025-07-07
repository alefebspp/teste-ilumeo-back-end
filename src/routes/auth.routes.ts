import z from "zod";

import makeUserController from "@/module/auth/factories/auth-controller.factory";
import { FastifyTypedInstance } from "@/types";
import { loginSchema, registerSchema } from "@/module/auth/auth.schemas";

export default async function authRoutes(app: FastifyTypedInstance) {
  const authController = makeUserController();

  app.post(
    "/register",
    {
      schema: {
        operationId: "register",
        description: "Register a new user",
        tags: ["Auth"],
        body: registerSchema,
        response: {
          201: z.object({ message: z.string() }),
        },
      },
    },
    authController.register
  );

  app.post(
    "/sign-in",
    {
      schema: {
        operationId: "login",
        description: "Login",
        tags: ["Auth"],
        body: loginSchema,
        response: {
          200: z.object({
            token: z.string(),
            user: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
        },
      },
    },
    authController.login
  );
}
