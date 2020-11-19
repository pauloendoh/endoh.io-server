import { User } from '../entity/User'
import { MyError } from './ErrorMessage'

const validateUser = (user: User): MyError[] => {
    let errors: MyError[] = []
    if (!user.email.length) {
        errors.push({ field: 'email', message: 'Email is required' })
    }
    if (!user.username.length) {
        errors.push({ field: 'username', message: 'Username is required' })
    }

    if (!user.password.length) {
        errors.push({ field: 'password', message: 'Password is required' })
    }
    else if (user.password.length < 6) {
        errors.push({
            field: 'password',
            message: 'Password must have at least 6 characters'
        })
    }

    return errors
}

export default validateUser 