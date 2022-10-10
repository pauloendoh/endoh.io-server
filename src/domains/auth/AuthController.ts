import { v4 as uuidv4 } from "uuid"

import { sign } from "jsonwebtoken"

import { compare, genSalt, hash } from "bcryptjs"

import { randomBytes } from "crypto"
import { Response } from "express"
import passport from "passport"
import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers"
import { getCustomRepository, getRepository, MoreThan } from "typeorm"
import { USER_TOKEN_TYPES } from "../../consts/USER_TOKEN_TYPES"
import { UserToken } from "../../entities/OAuthToken"
import { User } from "../../entities/User"
import { UserPreference } from "../../entities/UserPreference"
import { DotEnvKeys } from "../../enums/DotEnvKeys"
import { AuthChangePasswordPostDto } from "../../interfaces/dtos/auth/AuthChangePasswordPostDto"
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto"
import { PasswordResetPostDto } from "../../interfaces/dtos/auth/PasswordResetPostDto"
import { UserDeleteDto } from "../../interfaces/dtos/auth/UserDeleteDto"
import { UsernamePutDto } from "../../interfaces/dtos/auth/UsernamePutDto"
import { UserTokenPostDto } from "../../interfaces/dtos/auth/UserTokenPostDto"
import UserRepository from "../../repositories/UserRepository"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { addMinutes } from "../../utils/time/addMinutes"
import validateUserFields from "../../utils/validateUser"

@JsonController("/auth")
export class AuthController {
  constructor(
    private tokenRepo = getRepository(UserToken),
    private userRepo = getCustomRepository(UserRepository),
    private preferenceRepo = getRepository(UserPreference)
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
  @Post("/google/login")
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

  @Post("/password-reset")
  async passwordReset(@Body() body: PasswordResetPostDto) {
    const { password, token, userId } = body

    // Token exists?
    const tokenExists = await this.tokenRepo.findOne({
      userId,
      token,
      type: USER_TOKEN_TYPES.passwordReset,
      expiresAt: MoreThan(new Date().toISOString()),
    })

    // se existe, faz a alteração de senha
    if (tokenExists) {
      const user = await this.userRepo.findOne({ id: userId })

      const salt = await genSalt(10)
      user.password = await hash(password, salt)

      await this.userRepo.save(user)
      await this.tokenRepo.delete({
        userId,
        type: USER_TOKEN_TYPES.passwordReset,
      })

      return true
    }

    throw new BadRequestError("Token does not exist or it is expired.")
  }

  @Post("/authenticated-password-change")
  async authenticatedPasswordChange(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: AuthChangePasswordPostDto
  ) {
    const { oldPassword, newPassword } = body

    const passwordOk = await compare(oldPassword, requester.password)
    if (passwordOk) {
      const userRepo = getCustomRepository(UserRepository)

      const salt = await genSalt(10)
      const newPasswordHashed = await hash(newPassword, salt)
      requester.password = newPasswordHashed
      await userRepo.save(requester)

      return true
    }

    throw new BadRequestError("Incorrect password.")
  }

  @Delete("/")
  async deleteAccount(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: UserDeleteDto
  ) {
    const { password } = body

    const passwordOk = await compare(password, requester.password)

    if (!passwordOk) throw new BadRequestError("Incorrect password.")
    if (passwordOk) {
      const userRepo = getCustomRepository(UserRepository)

      await userRepo.delete({ id: requester.id })

      return true
    }
  }

  @Put("/username")
  async changeUsername(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: UsernamePutDto
  ) {
    const { newUsername } = body

    const userRepo = getCustomRepository(UserRepository)
    const usernameExists = await userRepo.findOne({ username: newUsername })

    if (usernameExists) {
      throw new BadRequestError("Username already in use.")
    }

    // Checking if username is valid
    const regex = new RegExp(/^[a-zA-Z0-9]+$/)
    if (!regex.test(newUsername)) {
      throw new BadRequestError(
        "Invalid characters for username. Only use letters and numbers."
      )
    }

    requester.username = newUsername
    await userRepo.save(requester)

    return true
  }

  @Get("/temp-user")
  async getTempUser() {
    const username = uuidv4()
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 1))

    const user = await this.userRepo.save({
      username: username,
      email: username + "@" + username + ".com",
      password: username,
      expiresAt: expireDate.toISOString(),
    })

    // Signing in and returning  user's token
    const ONE_DAY_IN_SECONDS = 3600 * 24

    const authUser = await new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: user.id },
        process.env[DotEnvKeys.JWT_SECRET],
        { expiresIn: ONE_DAY_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(user, token, expireDate))
        }
      )
    })
    return authUser
  }

  @Get("/user-preference")
  async getUserPreferences(@CurrentUser({ required: true }) requester: User) {
    return this.preferenceRepo.findOne({ user: requester })
  }

  @Post("/user-preference")
  async saveUserPreferences(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: UserPreference
  ) {
    body.user = requester

    const preferenceRepo = getRepository(UserPreference)
    return preferenceRepo.save(body)
  }
}
