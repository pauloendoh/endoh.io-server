import { config } from "dotenv"
import { verify } from "jsonwebtoken"
import { UnauthorizedError } from "routing-controllers"
import { User } from "../../../entities/User"
import UserRepository from "../../../repositories/UserRepository"
config()

export const validateJwt = (token: string) => {
  return new Promise<User>((res, rej) => {
    verify(
      token,
      String(process.env.JWT_SECRET),
      async (error, decodedObj: any) => {
        if (error) {
          return rej(new UnauthorizedError("Token is not valid."))
        }

        const user = await UserRepository.findOne({
          where: {
            id: decodedObj["userId"],
          },
        })
        if (!user) return rej(new UnauthorizedError("Token is not valid."))

        return res(user)
      }
    )
  })
}
