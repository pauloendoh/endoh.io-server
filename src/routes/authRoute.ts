import { compare, genSalt, hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';

import { DotEnvNames } from '../consts/dotenv';
import { AuthUserGetDto } from '../dtos/AuthUserGetDto';
import { User } from '../entity/User';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';
import validateUser from '../utils/validateUser';

const authRoute = Router()

authRoute.get('/', async (req, res) => {
    return res.json('xd')
})

authRoute.post('/register', async (req: MyAuthRequest, res) => {
    try {
        const sentUser = req.body as User
        const sentUserErrors = validateUser(sentUser)
        if(sentUserErrors.length){
            return res.status(400).json(new MyErrorsResponse().addErrors(sentUserErrors))
        }

        let userRepo = getCustomRepository(UserRepository)

        // Checking if email exists 
        let userExists = await userRepo.findOne({ email: sentUser.email })
        if (userExists) {
            return res.status(400).json(new MyErrorsResponse('Email already in use', 'email'))
        }

        // Checking if username exists
        userExists = await userRepo.findOne({ username: sentUser.username })
        if (userExists) {
            return res.status(400).json(new MyErrorsResponse('Username already in use', 'username'))
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
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

authRoute.post('/login', async (req: Request, res: Response) => {
    try {
        const sentUser = req.body as User
        sentUser.username = sentUser.email

        const sentUserErrors = validateUser(sentUser)
        if(sentUserErrors.length){
            return res.status(400).json(new MyErrorsResponse().addErrors(sentUserErrors))
        }

        let userRepo = getCustomRepository(UserRepository)

        // Check if username or email exists 
        let user = await userRepo.findOne({
            where: [
                { email: sentUser.email },
                { username: sentUser.email }]
        })
        if (!user) {
            return res.status(400).json(new MyErrorsResponse('Invalid email or username'))
        }

        // Check if password is ok 
        const passwordOk = await compare(sentUser.password, user.password)
        if (!passwordOk) {
            return res.status(400).json(new MyErrorsResponse('Invalid password', 'password'))
        }

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
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

export default authRoute