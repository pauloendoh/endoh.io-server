import { verify as validateJwt } from "jsonwebtoken";

import { ExpressMiddlewareInterface } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { DotEnvKeys } from "../enums/DotEnvKeys";
import UserRepository from "../repositories/UserRepository";
import { MyErrorsResponse } from "../utils/ErrorMessage";

export class MyAuthMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional

  use(req: any, res: any, next?: (err?: any) => any): any {
    {
      const authToken = req.header("x-auth-token");

      if (!authToken)
        return res
          .status(401)
          .json(
            new MyErrorsResponse(
              "No token, authorization denied! Sign in and try again."
            )
          );

      // Verify token
      try {
        validateJwt(
          authToken,
          process.env[DotEnvKeys.JWT_SECRET],
          async (error, decodedObj) => {
            //if userId is string, it means it is getting the token from another cookie..
            if (error || typeof decodedObj["userId"] === "string") {
              return res
                .status(401)
                .json({ msg: "Token is not valid. Sign in and try again." });
            } else {
              req.user = await getCustomRepository(UserRepository).findOne({
                id: decodedObj["userId"],
              });
              next();
            }
          }
        );
      } catch (err) {
        res.status(500).json(new MyErrorsResponse("Server Error"));
      }
    }
  }
}
