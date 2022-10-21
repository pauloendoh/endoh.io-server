import { v4 as uuidv4 } from "uuid"

import { sign } from "jsonwebtoken"

import { compare, genSalt, hash } from "bcryptjs"

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
import { dataSource } from "../../dataSource"
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
import { AuthService } from "./AuthService"

@JsonController("/auth")
export class AuthController {
  constructor(
    private tokenRepo = dataSource.getRepository(UserToken),
    private userRepo = UserRepository,
    private preferenceRepo = dataSource.getRepository(UserPreference),
    private authService = new AuthService()
  ) {}

  @Post("/register")
  async register(
    @Body()
    body: User
  ) {
    return this.authService.register(body)
  }

  @Post("/login")
  async login(
    @Body()
    body: User
  ) {
    return this.authService.login(body)
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
    const redirectTo = await this.authService.saveGoogleTokenAndReturnRedirectURL(
      req.user
    )

    res.redirect(redirectTo)

    return res
  }

  // The front-end uses the token and userId in the URL to finish the login
  @Post("/google/login")
  async loginWithUserIdAndGoogleToken(@Body() body: UserTokenPostDto) {
    return this.authService.loginWithUserIdAndGoogleToken(body)
  }

  @Post("/password-reset")
  async resetPassword(@Body() body: PasswordResetPostDto) {
    this.authService.resetPassword(body)
  }

  @Post("/authenticated-password-change")
  async authenticatedPasswordChange(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: AuthChangePasswordPostDto
  ) {
    const { oldPassword, newPassword } = body

    const passwordOk = await compare(oldPassword, requester.password)
    if (passwordOk) {
      const salt = await genSalt(10)
      const newPasswordHashed = await hash(newPassword, salt)
      requester.password = newPasswordHashed
      await this.userRepo.save(requester)

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
      await this.userRepo.delete({ id: requester.id })

      return true
    }
  }

  @Put("/username")
  async changeUsername(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: UsernamePutDto
  ) {
    const { newUsername } = body

    const usernameExists = await this.userRepo.findOne({
      where: {
        username: newUsername,
      },
    })

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
    await this.userRepo.save(requester)

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
    const ONE_MONTH_IN_SECONDS = 3600 * 24 * 30

    const authUser = await new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: user.id },
        process.env[DotEnvKeys.JWT_SECRET],
        { expiresIn: ONE_MONTH_IN_SECONDS },
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
    return this.preferenceRepo.findOne({
      where: {
        user: {
          id: requester.id,
        },
      },
    })
  }

  @Post("/user-preference")
  async saveUserPreferences(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: UserPreference
  ) {
    body.user = requester

    return this.preferenceRepo.save(body)
  }
}
