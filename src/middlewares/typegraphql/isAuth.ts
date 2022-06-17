import { verify as validateJwt } from "jsonwebtoken";

import { MiddlewareFn } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { DotEnvKeys } from "../../enums/DotEnvKeys";
import UserRepository from "../../repositories/UserRepository";
import { MyContext } from "./MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { req } = context;
  const authToken = req.header("x-auth-token");

  if (!authToken) {
    throw new Error("No token, authorization denied! Sign in and try again.");
  }

  // Verify token
  try {
    const promise = new Promise<MyContext>((res, rej) => {
      validateJwt(
        authToken,
        process.env[DotEnvKeys.JWT_SECRET],
        async (error, decodedObj) => {
          //if userId is string, it means it is getting the token from another cookie..
          if (error || typeof decodedObj["userId"] === "string") {
            throw new Error("Token is not valid. Sign in and try again.");
          } else {
            context.req.user = await getCustomRepository(
              UserRepository
            ).findOne({
              id: decodedObj["userId"],
            });
            return res(context);
          }
        }
      );
    });

    await promise;

    return next();
  } catch (err) {
    throw new Error("Server Error");
  }
};
