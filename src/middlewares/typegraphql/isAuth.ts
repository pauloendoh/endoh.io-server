import { verify as validateJwt } from "jsonwebtoken"

import { MiddlewareFn } from "type-graphql"
import { dataSource } from "../../dataSource"
import { User } from "../../entities/User"
import { myEnvs } from "../../utils/myEnvs"
import { MyContext } from "./MyContext"

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { req } = context
  const authToken = req.header("x-auth-token")

  if (!authToken) {
    throw new Error("No token, authorization denied! Sign in and try again.")
  }

  // Verify token
  try {
    const promise = new Promise<MyContext>((res, rej) => {
      validateJwt(authToken, myEnvs.JWT_SECRET, async (error, decodedObj) => {
        //if userId is string, it means it is getting the token from another cookie..
        if (error || !decodedObj || typeof decodedObj["userId"] === "string") {
          throw new Error("Token is not valid. Sign in and try again.")
        }

        const user = await dataSource.getRepository(User).findOne({
          where: {
            id: decodedObj["userId"],
          },
        })

        if (!user) {
          throw new Error("Token is not valid. Sign in and try again.")
        }

        context.req.user = user
        return res(context)
      })
    })

    await promise

    return next()
  } catch (err) {
    throw new Error("Server Error")
  }
}
