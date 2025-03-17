import type { User as UserEntity } from "../entities/User"

export {}

declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
