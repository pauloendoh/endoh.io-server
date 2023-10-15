import { User } from "../../../entities/User"

export function userToSimpleUserDto(user: User) {
  const { password, preference, googleId, ...rest } = user

  return {
    ...rest,
  }
}
