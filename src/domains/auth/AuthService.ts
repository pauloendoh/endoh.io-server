import { randomBytes, randomUUID } from "crypto"

import { compare, genSalt, hash } from "bcryptjs"

import { sign } from "jsonwebtoken"

import { BadRequestError } from "routing-controllers"
import { MoreThan } from "typeorm"
import { USER_TOKEN_TYPES } from "../../consts/USER_TOKEN_TYPES"
import { dataSource } from "../../dataSource"
import { UserToken } from "../../entities/OAuthToken"
import { User } from "../../entities/User"
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto"
import { PasswordResetPostDto } from "../../interfaces/dtos/auth/PasswordResetPostDto"
import { UserTokenPostDto } from "../../interfaces/dtos/auth/UserTokenPostDto"
import { UserRepository } from "../../repositories/UserRepository"
import { myEnvs } from "../../utils/myEnvs"
import { addMinutes } from "../../utils/time/addMinutes"
import validateUserFields from "../../utils/validateUser"
import { $SaveUser } from "../user/use-cases/$SaveUser"
import { RegisterDto } from "./types/RegisterDto"

export class AuthService {
  constructor(
    private readonly userRepo = new UserRepository(),
    private readonly tokenRepo = dataSource.getRepository(UserToken),
    private readonly $saveUser = new $SaveUser()
  ) {}

  async register(dto: RegisterDto) {
    // only creates an instance. Doesn't save on DB
    const sentUser = this.userRepo.rawRepo.create(dto)
    const userErrors = validateUserFields(sentUser)
    if (userErrors.length) {
      throw new BadRequestError(userErrors[0].message)
    }

    if (dto.password !== dto.password2)
      throw new BadRequestError("Passwords are different!")

    // Checking if email exists
    let userExists = await this.userRepo.rawRepo.findOne({
      where: {
        email: sentUser.email,
      },
    })

    if (userExists) {
      throw new BadRequestError("Email already in use")
    }

    // Checking if username exists
    userExists = await this.userRepo.rawRepo.findOne({
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

    const savedUser = await this.$saveUser.exec(sentUser)

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    if (!savedUser) throw new Error("User not saved")

    const promise = new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: savedUser.id },
        myEnvs.JWT_SECRET,
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) throw err
          res(new AuthUserGetDto(savedUser, token || null, expireDate))
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
    const user = await this.userRepo.rawRepo.findOne({
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
        myEnvs.JWT_SECRET,
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(user, token || null, expireDate))
        }
      )
    })

    const authUser = await promise

    return authUser
  }

  async keepTempUser(dto: RegisterDto, userId: number) {
    const previousTempUser = await this.userRepo.rawRepo.findOne({
      where: { id: userId },
    })
    if (!previousTempUser) throw new BadRequestError("User not found")

    // only creates an instance. Doesn't save on DB
    const sentUser = this.userRepo.rawRepo.create(dto)
    const userErrors = validateUserFields(sentUser)
    if (userErrors.length) {
      throw new BadRequestError(userErrors[0].message)
    }

    if (dto.password !== dto.password2)
      throw new BadRequestError("Passwords are different!")

    // Checking if email exists
    let userExists = await this.userRepo.rawRepo.findOne({
      where: {
        email: sentUser.email,
      },
    })

    if (userExists) {
      throw new BadRequestError("Email already in use")
    }

    // Checking if username exists
    userExists = await this.userRepo.rawRepo.findOne({
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

    const savedUser = await this.$saveUser.exec(previousTempUser)
    if (!savedUser) {
      throw new Error("User not saved")
    }

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    const promise = new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: savedUser.id },
        myEnvs.JWT_SECRET,
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) throw err
          res(new AuthUserGetDto(savedUser, token || null, expireDate))
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

    const encoded = encodeURI(
      process.env.CLIENT_BASE_URL +
        "?oauthToken=" +
        oauthToken.token +
        "&userId=" +
        oauthToken.userId
    )

    console.log({
      encoded,
    })

    return encoded
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

    const user = await this.userRepo.rawRepo.findOne({
      where: {
        id: userId,
      },
    })
    if (!user) {
      throw new BadRequestError("User not found")
    }

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
        myEnvs.JWT_SECRET,
        { expiresIn: ONE_YEAR_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(user, token || null, expireDate))
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

    const user = await this.userRepo.rawRepo.findOne({
      where: {
        id: userId,
      },
    })
    if (!user) throw new BadRequestError("User not found")

    const salt = await genSalt(10)
    user.password = await hash(password, salt)

    await this.$saveUser.exec(user)
    await this.tokenRepo.delete({
      userId,
      type: USER_TOKEN_TYPES.passwordReset,
    })

    return true
  }

  async createTempUser() {
    const username = randomUUID()
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 30))

    const payload = new User()
    payload.username = username
    payload.email = username + "@" + username + ".com"
    payload.password = username
    payload.expiresAt = expireDate.toISOString()

    const savedUser = await this.$saveUser.exec(payload)

    // Signing in and returning  user's token
    const ONE_MONTH_IN_SECONDS = 3600 * 24 * 30

    const authUser = await new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: savedUser.id },
        myEnvs.JWT_SECRET,
        { expiresIn: ONE_MONTH_IN_SECONDS },
        (err, token) => {
          if (err) return rej(err)
          return res(new AuthUserGetDto(savedUser, token || null, expireDate))
        }
      )
    })
    return authUser
  }
}
