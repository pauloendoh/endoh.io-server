import { User } from '../entity/User';

// PE 3/3 
export class AuthUserGetDto {
    id: number
    username: string
    email: string
    picture: string

    token: string
    expiresAt: Date

    constructor(user: User, token: string, expiresAt: Date) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.picture = user.picture 
        this.token = token
        this.expiresAt = expiresAt
    }
}