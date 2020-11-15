import { AuthUserGetDto } from '../dtos/GetAuthUserDto';
import { compare, genSalt, hash } from 'bcrypt'
import { json, Request, Response, Router } from 'express'
import { sign } from 'jsonwebtoken'
import { DotEnvNames } from '../consts/dotenv'
import { User } from '../entity/User'
import UserRepository from '../repositories/UserRepository'
import ErrorMessage from '../utils/ErrorMessage'
import { getCustomRepository } from 'typeorm';
import { myConsoleError } from '../utils/myConsoleError';

const authRoute = Router()

authRoute.get('/', async (req, res) => {
    return res.json('xd')
})

authRoute.post('/register', async (req, res) => {
    try {
        const sentUser = req.body as User
        let userRepo = getCustomRepository(UserRepository)

        // Checking if email exists 
        let userExists = await userRepo.findOne({ email: sentUser.email })
        if (userExists) {
            return res.status(400).json(new ErrorMessage('Email already in use'))
        }

        // Checking if username exists
        userExists = await userRepo.findOne({ username: sentUser.username })
        if (userExists) {
            return res.status(400).json(new ErrorMessage('Username already in use'))
        }

        const salt = await genSalt(10)
        sentUser.password = await hash(sentUser.password, salt)

        const savedUser = await userRepo.save(sentUser)

        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

        sign({ userId: savedUser.id },
            process.env[DotEnvNames.JWT_SECRET],
            { expiresIn: FIVE_DAYS_IN_SECONDS },
            (err, token) => {
                if (err)
                    throw err
                return res.json(new AuthUserGetDto(savedUser, token, expireDate))
            })

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

authRoute.post('/login', async (req: Request, res: Response) => {
    try {
        const sentData = req.body as User
        let userRepo = getCustomRepository(UserRepository)

        // Check if username or email exists 
        let user = await userRepo.findOne({
            where: [
                { email: sentData.email },
                { username: sentData.email }]
        })
        if (!user)
            return res.status(400).json(new ErrorMessage('Invalid email or username.'))

        // Check if password is ok 
        const passwordOk = await compare(sentData.password, user.password)
        if (!passwordOk)
            return res.status(400).json({ errors: [{ msg: 'Invalid password' }] })

        // Signing in and returning  user's token 
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

        sign({ userId: user.id },
            process.env[DotEnvNames.JWT_SECRET],
            { expiresIn: FIVE_DAYS_IN_SECONDS },
            (err, token) => {
                if (err)
                    throw err
                return res.json(new AuthUserGetDto(user, token, expireDate))
            })

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

export default authRoute