import { FastifyReply, FastifyRequest } from "fastify";
import { addHours } from "date-fns";

import UserRepository from "@/module/user/repository/user.repository";
import {
  makeLoginService,
  makeRegisterService,
} from "./factories/auth-services.factory";
import { registerSchema, loginSchema } from "./auth.schemas";

export default function authController(userRepository: UserRepository) {
  return {
    async register(request: FastifyRequest, reply: FastifyReply) {
      const body = registerSchema.parse(request.body);

      const registerUserService = makeRegisterService(userRepository);

      await registerUserService(body);

      return reply
        .status(200)
        .send({ message: "Usuário cadastrado com sucesso." });
    },
    async login(request: FastifyRequest, reply: FastifyReply) {
      const body = loginSchema.parse(request.body);

      const loginService = makeLoginService(userRepository);

      const { user } = await loginService(body);

      const { passwordHash, ...data } = user;

      const normalizedUser = data;

      const token = await reply.jwtSign({
        sign: {
          sub: user.id,
        },
      });

      const refreshToken = await reply.jwtSign({
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      });

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: false,
          sameSite: true,
          httpOnly: true,
          expires: addHours(new Date(), 1),
        })
        .status(200)
        .send({ token, user: normalizedUser });
    },
  };
}
