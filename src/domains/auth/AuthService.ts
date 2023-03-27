import { randomBytes } from "crypto"

import { compare, genSalt, hash } from "bcryptjs"

import { sign } from "jsonwebtoken"

import { BadRequestError } from "routing-controllers"
import { MoreThan } from "typeorm"
import { USER_TOKEN_TYPES } from "../../consts/USER_TOKEN_TYPES"
import { dataSource } from "../../dataSource"
import { UserToken } from "../../entities/OAuthToken"
import { User } from "../../entities/User"
import { DotEnvKeys } from "../../enums/DotEnvKeys"
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto"
import { PasswordResetPostDto } from "../../interfaces/dtos/auth/PasswordResetPostDto"
import { UserTokenPostDto } from "../../interfaces/dtos/auth/UserTokenPostDto"
import UserRepository from "../../repositories/UserRepository"
import { addMinutes } from "../../utils/time/addMinutes"
import validateUserFields from "../../utils/validateUser"
import { RegisterDto } from "./types/RegisterDto"

export class AuthService {
  constructor(
    private userRepo = UserRepository,
    private tokenRepo = dataSource.getRepository(UserToken)
  ) {}

  async register(dto: RegisterDto) {
    // only creates an instance. Doesn't save on DB
    const sentUser = this.userRepo.create(dto)
    const userErrors = validateUserFields(sentUser)
    if (userErrors.length) {
      throw new BadRequestError(userErrors[0].message)
    }

    if (dto.password !== dto.password2)
      throw new BadRequestError("Passwords are different!")

    // Checking if email exists
    let userExists = await this.userRepo.findOne({
      where: {
        email: sentUser.email,
      },
    })

    if (userExists) {
      throw new BadRequestError("Email already in use")
    }

    // Checking if username exists
    userExists = await this.userRepo.findOne({
      where: {
        username: sentUser.username,
      },
    })
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

    const savedUser = await this.userRepo.saveAndGetRelations(sentUser)
    //  = await userRepo.save(sentUser)

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
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
  }

  async login(sentUser: User) {
    sentUser.username = sentUser.email // We just use email here, but we don't want to validate empty username
 
    const fieldErrors = validateUserFields(sentUser)
    if (fieldErrors.length) {
      throw new BadRequestError(fieldErrors[0].message)
    }

    // username or email exists ?
    let user = await this.userRepo.findOne({
      where: [{ email: sentUser.email }, { username: sentUser.email }],
    })
    if (!user) {
      throw new BadRequestError("Invalid email or username")
    }

    // password is ok ?
    const passwordOk = await compare(sentUser.password, user.password)
    if (!passwordOk) {
      throw new BadRequestError("Invalid password")
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

  async keepTempUser(dto: RegisterDto, userId: number) {
    const previousTempUser = await this.userRepo.findOne({
      where: { id: userId },
    })

    // only creates an instance. Doesn't save on DB
    const sentUser = this.userRepo.create(dto)
    const userErrors = validateUserFields(sentUser)
    if (userErrors.length) {
      throw new BadRequestError(userErrors[0].message)
    }

    if (dto.password !== dto.password2)
      throw new BadRequestError("Passwords are different!")

    // Checking if email exists
    let userExists = await this.userRepo.findOne({
      where: {
        email: sentUser.email,
      },
    })

    if (userExists) {
      throw new BadRequestError("Email already in use")
    }

    // Checking if username exists
    userExists = await this.userRepo.findOne({
      where: {
        username: sentUser.username,
      },
    })
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

    const salt = await genSalt(10)
    sentUser.password = await hash(sentUser.password, salt)

    previousTempUser.username = sentUser.username
    previousTempUser.password = sentUser.password
    previousTempUser.email = sentUser.email
    previousTempUser.expiresAt = null

    const savedUser = await this.userRepo.saveAndGetRelations(previousTempUser)

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
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
  }

  async saveGoogleTokenAndReturnRedirectURL(user: User) {
    const oauthToken = await this.tokenRepo.save({
      userId: user.id,
      type: USER_TOKEN_TYPES.googleOauth,
      token: randomBytes(64).toString("hex"),
      expiresAt: addMinutes(new Date(), 15).toISOString(),
    })

    return (
      process.env.CLIENT_BASE_URL +
      "?oauthToken=" +
      oauthToken.token +
      "&userId=" +
      oauthToken.userId
    )
  }

  async loginWithUserIdAndGoogleToken(body: UserTokenPostDto) {
    const { userId, token } = body

    const tokenExists = await this.tokenRepo.findOne({
      where: {
        userId,
        token,
        expiresAt: MoreThan(new Date().toISOString()),
      },
    })

    if (!tokenExists) {
      throw new BadRequestError("No OAuthToken found.")
    }

    // Same process as POST /auth/login

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    })

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

  async resetPassword(body: PasswordResetPostDto) {
    const { password, token, userId } = body

    // Token exists?
    const tokenExists = await this.tokenRepo.findOne({
      where: {
        userId,
        token,
        type: USER_TOKEN_TYPES.passwordReset,
        expiresAt: MoreThan(new Date().toISOString()),
      },
    })

    if (!tokenExists)
      throw new BadRequestError("Token does not exist or it is expired.")

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    })

    const salt = await genSalt(10)
    user.password = await hash(password, salt)

    await this.userRepo.save(user)
    await this.tokenRepo.delete({
      userId,
      type: USER_TOKEN_TYPES.passwordReset,
    })

    return true
  }
}
