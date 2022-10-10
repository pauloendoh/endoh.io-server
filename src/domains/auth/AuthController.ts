import { sign } from "jsonwebtoken"

import { compare, genSalt, hash } from "bcryptjs"

import { randomBytes } from "crypto"
import { Response } from "express"
import passport from "passport"
import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
} from "routing-controllers"
import { getCustomRepository, getRepository, MoreThan } from "typeorm"
import { USER_TOKEN_TYPES } from "../../consts/USER_TOKEN_TYPES"
import { UserToken } from "../../entities/OAuthToken"
import { User } from "../../entities/User"
import { DotEnvKeys } from "../../enums/DotEnvKeys"
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto"
import { UserTokenPostDto } from "../../interfaces/dtos/auth/UserTokenPostDto"
import UserRepository from "../../repositories/UserRepository"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { addMinutes } from "../../utils/time/addMinutes"
import validateUserFields from "../../utils/validateUser"

@JsonController("/auth")
export class AuthController {
  constructor(
    private tokenRepo = getRepository(UserToken),
    private userRepo = getCustomRepository(UserRepository)
  ) {}

  @Post("/register")
  async register(
    @Body()
    body: User
  ) {
    try {
      const userRepo = getCustomRepository(UserRepository)

      const sentUser = userRepo.create(body)
      const userErrors = validateUserFields(sentUser)
      if (userErrors.length) {
        throw new BadRequestError(userErrors[0].message)
      }

      // Checking if email exists
      let userExists = await userRepo.findOne({ email: sentUser.email })
      if (userExists) {
        throw new BadRequestError("Email already in use")
      }

      // Checking if username exists
      userExists = await userRepo.findOne({ username: sentUser.username })
      if (userExists) {
        throw new BadRequestError("Username already in use")
      }

      // Checking if username is valid
      const regex = new RegExp(/^[a-zA-Z0-9]+$/)
      if (!regex.test(sentUser.username)) {
        throw new BadRequestError(
          "Invalid characters for username. Only use letters and numbers."
        )
      }

      // bcrypt user password
      const salt = await genSalt(10)
      sentUser.password = await hash(sentUser.password, salt)

      const savedUser = await getCustomRepository(
        UserRepository
      ).saveAndGetRelations(sentUser)
      //  = await userRepo.save(sentUser)

      const expireDate = new Date(
        new Date().setDate(new Date().getDate() + 365)
      )
      const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

      const promise = new Promise<AuthUserGetDto>((res, rej) => {
        sign(
          { userId: savedUser.id },
          process.env[DotEnvKeys.JWT_SECRET],
          { expiresIn: ONE_YEAR_IN_SECONDS },
          (err, token) => {
            if (err) throw err
            res(new AuthUserGetDto(savedUser, token, expireDate))
          }
        )
      })

      return await promise
    } catch (e) {
      throw e
    }
  }

  @Post("/login")
  async login(
    @Body()
    body: User
  ) {
    body.username = body.email // We just use email here, but we don't want to validate empty username

    const fieldErrors = validateUserFields(body)
    if (fieldErrors.length) {
      throw new BadRequestError(fieldErrors[0].message)
    }

    let userRepo = getCustomRepository(UserRepository)

    // username or email exists ?
    let user = await userRepo.findOne({
      where: [{ email: body.email }, { username: body.email }],
    })
    if (!user) {
      return new BadRequestError("Invalid email or username")
    }

    // password is ok ?
    const passwordOk = await compare(body.password, user.password)
    if (!passwordOk) {
      throw new BadRequestError("Invalid password.")
    }

    // Signing in and returning  user's token
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    const promise = new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: user.id },
        process.env[DotEnvKeys.JWT_SECRET],
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(user, token, expireDate))
        }
      )
    })

    const authUser = await promise

    return authUser
  }

  @Get("/me")
  async getAuthUser(@CurrentUser({ required: true }) user: User) {
    return new AuthUserGetDto(user, null, null)
  }

  @Get("/google")
  @UseBefore(passport.authenticate("google", { scope: ["profile", "email"] }))
  async loginWithGoogle() {}

  // After successful authentication at google page...
  @Get("/google/callback")
  @UseBefore(passport.authenticate("google"))
  async googleCallback(@Req() req: MyAuthRequest, @Res() res: Response) {
    const user = req.user as User
    const oauthToken = await this.tokenRepo.save({
      userId: user.id,
      type: USER_TOKEN_TYPES.googleOauth,
      token: randomBytes(64).toString("hex"),
      expiresAt: addMinutes(new Date(), 15).toISOString(),
    })

    res.redirect(
      process.env.CLIENT_BASE_URL +
        "?oauthToken=" +
        oauthToken.token +
        "&userId=" +
        oauthToken.userId
    )

    return res
  }

  // The front-end uses the token and userId in the URL to finish the login
  @Get("/google/login")
  @UseBefore(passport.authenticate("google"))
  async googleLogin(@Body() body: UserTokenPostDto) {
    const { userId, token } = body

    const tokenExists = await this.tokenRepo.findOne({
      userId,
      token,
      expiresAt: MoreThan(new Date().toISOString()),
    })

    if (!tokenExists) {
      throw new BadRequestError("No OAuthToken found.")
    }

    // Same process as POST /auth/login

    const user = await this.userRepo.findOne({ id: userId })

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    // req.logout();
    await this.tokenRepo.delete({
      userId: user.id,
      type: USER_TOKEN_TYPES.googleOauth,
    })

    const authUser = await new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: user.id },
        process.env[DotEnvKeys.JWT_SECRET],
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(user, token, expireDate))
        }
      )
    })

    return authUser
  }
}
