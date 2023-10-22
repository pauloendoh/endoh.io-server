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
import { User } from "../../entities/User"
import { UserPreference } from "../../entities/UserPreference"
import { AuthChangePasswordPostDto } from "../../interfaces/dtos/auth/AuthChangePasswordPostDto"
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto"
import { PasswordResetPostDto } from "../../interfaces/dtos/auth/PasswordResetPostDto"
import { UserDeleteDto } from "../../interfaces/dtos/auth/UserDeleteDto"
import { UserTokenPostDto } from "../../interfaces/dtos/auth/UserTokenPostDto"
import { UsernamePutDto } from "../../interfaces/dtos/auth/UsernamePutDto"
import UserRepository from "../../repositories/UserRepository"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { $SaveUser } from "../user/use-cases/$SaveUser"
import { AuthService } from "./AuthService"
import { RegisterDto } from "./types/RegisterDto"

@JsonController("/auth")
export class AuthController {
  constructor(
    private userRepo = UserRepository,
    private preferenceRepo = dataSource.getRepository(UserPreference),
    private authService = new AuthService(),
    private $saveUser = new $SaveUser()
  ) {}

  @Post("/register")
  async register(
    @Body()
    body: RegisterDto
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
  @UseBefore(
    passport.authenticate("google", {
      session: false,
    })
  )
  async googleCallback(@Req() req: MyAuthRequest, @Res() res: Response) {
    const redirectTo =
      await this.authService.saveGoogleTokenAndReturnRedirectURL(req.user)

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
    return this.authService.resetPassword(body)
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
      await this.$saveUser.exec(requester)

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
    await this.$saveUser.exec(requester)

    return true
  }

  @Get("/temp-user")
  async getTempUser() {
    return this.authService.createTempUser()
  }

  @Post("/keep-temp-user")
  async keepTempUser(
    @Body() dto: RegisterDto,
    @CurrentUser({ required: true }) user: User
  ) {
    return this.authService.keepTempUser(dto, user.id)
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
