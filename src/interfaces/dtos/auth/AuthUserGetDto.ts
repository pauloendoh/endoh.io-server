import { User } from "../../../entities/User"
import { UserPreference } from "../../../entities/UserPreference"

// PE 3/3
export class AuthUserGetDto {
  id: number
  username: string
  email: string
  userExpiresAt: string
  isAdmin: boolean

  preference: UserPreference
  token: string
  tokenExpiresAt: Date

  constructor(user: User, token: string, tokenExpiresAt: Date) {
    this.id = user.id
    this.username = user.username
    this.email = user.email
    this.preference = user.preference
    this.userExpiresAt = user.expiresAt
    this.isAdmin = user.isAdmin

    this.token = token
    this.tokenExpiresAt = tokenExpiresAt
  }
}
