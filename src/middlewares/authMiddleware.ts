import { NextFunction, Response } from "express"
import { verify as validateJwt } from "jsonwebtoken"
import { dataSource } from "../dataSource"
import { User } from "../entities/User"
import { MyErrorsResponse } from "../utils/ErrorMessage"
import { MyAuthRequest } from "../utils/MyAuthRequest"
import { myEnvs } from "../utils/myEnvs"

// PE 2/3
export default function authMiddleware(
  req: MyAuthRequest,
  res: Response,
  next: NextFunction
) {
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
      if (error || !decodedObj || typeof decodedObj["userId"] === "string") {
        return res
          .status(401)
          .json({ msg: "Token is not valid. Sign in and try again." })
      }
      const user = await dataSource.getRepository(User).findOne({
        where: {
          id: decodedObj["userId"],
        },
      })

      if (!user) {
        return res
          .status(401)
          .json({ msg: "Token is not valid. Sign in and try again." })
      }

      req.user = user
      next()
    })
  } catch (err) {
    res.status(500).json(new MyErrorsResponse("Server Error"))
  }
}
