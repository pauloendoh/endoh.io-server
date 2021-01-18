import { UserPreference } from './../../../entities/UserPreference';
import { User } from '../../../entities/User';

// PE 3/3 
export class AuthUserGetDto {
    id: number
    username: string
    email: string
    picture: string

    preference: UserPreference
    token: string
    expiresAt: Date

    constructor(user: User, token: string, expiresAt: Date) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.picture = user.picture
        this.preference = user.preference

        this.token = token
        this.expiresAt = expiresAt
    }
}