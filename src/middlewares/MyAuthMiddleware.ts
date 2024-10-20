import { verify as validateJwt } from "jsonwebtoken"

import { ExpressMiddlewareInterface } from "routing-controllers"
import { dataSource } from "../dataSource"
import { User } from "../entities/User"
import { MyErrorsResponse } from "../utils/ErrorMessage"
import { myEnvs } from "../utils/myEnvs"

export class MyAuthMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional

  use(req: any, res: any, next?: (err?: any) => any): any {
    const authToken = req.header("x-auth-token")

    if (!authToken)
      return res
        .status(401)
        .json(
          new MyErrorsResponse(
            "No token, authorization denied! Sign in and try again."
          )
        )

    // Verify token
    try {
      validateJwt(authToken, myEnvs.JWT_SECRET, async (error, decodedObj) => {
        //if userId is string, it means it is getting the token from another cookie..
        if (error || typeof decodedObj["userId"] === "string") {
          return res
            .status(401)
            .json({ msg: "Token is not valid. Sign in and try again." })
        } else {
          req.user = await dataSource.getRepository(User).findOne({
            where: {
              id: decodedObj["userId"],
            },
          })

          if (next) {
            next()
          }
        }
      })
    } catch (err) {
      res.status(500).json(new MyErrorsResponse("Server Error"))
    }
  }
}
