import { User } from '../entity/User';
export class AuthUserGetDto {
    id: number
    username: string
    email: string

    token: string
    expiresAt: Date

    constructor(user: User, token: string, expiresAt: Date) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.token = token
        this.expiresAt = expiresAt
    }
}