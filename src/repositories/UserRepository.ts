import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User>{

    async getAvailableUsername(email: string){
        const emailArr = email.split('@')
        if(emailArr.length === 1){
            throw Error("Invalid email")
        }

        const username = emailArr[0]
        const user = await this.findOne({username})
        if(!user){
            return username
        }

        let foundAvailableUsername = false
        let i = 0
        while(!foundAvailableUsername){
            const tryUsername = username + i
            const tryUser = await this.findOne({username: tryUsername})

            if(!tryUser){
                foundAvailableUsername = true
                return tryUsername
            }
            i++
        }
    }
}