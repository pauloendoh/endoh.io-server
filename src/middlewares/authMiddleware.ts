import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { dataSource } from "../dataSource"
import { User } from "../entities/User"
import { MyErrorsResponse } from "../utils/ErrorMessage"
import { myEnvs } from "../utils/myEnvs"

export function authMiddleware(
  req: Request,
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
    verify(authToken, myEnvs.JWT_SECRET, async (error, decodedObj) => {
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
