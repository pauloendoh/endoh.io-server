import { User } from "../../../entities/User"

export function clearUserFields(user: User) {
  const { password, preference, googleId, ...rest } = user
  return {
    ...rest,
  }
}
