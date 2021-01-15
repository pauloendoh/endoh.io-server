import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User>{

    async getAvailableUsernameByEmail(email: string) {
        const emailArr = email.split('@')
        if (emailArr.length === 1) {
            throw Error("Invalid email")
        }

        const username = emailArr[0]
        const user = await this.findOne({ username })
        if (!user) {
            return username
        }

        let foundAvailableUsername = false
        let i = 0
        while (!foundAvailableUsername) {
            const tryUsername = username + i
            const tryUser = await this.findOne({ username: tryUsername })

            if (!tryUser) {
                foundAvailableUsername = true
                return tryUsername
            }
            i++
        }
    }

    async getTemporaryUsers(): Promise<User[]> {
        return this.createQueryBuilder("user")
            .where("user.expiresAt IS NOT NULL")
            .getMany()
    }


    async getAvailableTempUsername() {
        const tempUsers = await this.getTemporaryUsers()

        let foundAvailable = false
        let i = tempUsers.length

        while (!foundAvailable) {
            const tryUsername = 'temp_user_' + i
            const tryUser = await this.findOne({ username: tryUsername })

            if (!tryUser) {
                foundAvailable = true
                return tryUsername
            }
            i++
        }
    }

    // wow, this seems dangerous haha :D 
    async deleteExpiredTempUsers(): Promise<DeleteResult> {
        
        return this.createQueryBuilder("user")
            .delete()
            .where('"expiresAt" < NOW()')
            .execute()
    }
}