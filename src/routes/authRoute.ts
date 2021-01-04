import { compare, genSalt, hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';

import { DotEnvKeys } from '../enums/DotEnvKeys';
import { AuthUserGetDto } from '../interfaces/dtos/AuthUserGetDto';
import { User } from '../entities/User';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';
import validateUserFields from '../utils/validateUser';
import * as passport from 'passport'
require('../utils/passport-setup')
require('dotenv').config()

const authRoute = Router()

// PE 2/3
authRoute.post('/register', async (req: MyAuthRequest, res) => {
    try {
        const sentUser = req.body as User
        const userErrors = validateUserFields(sentUser)
        if (userErrors.length) {
            return res.status(400).json(new MyErrorsResponse().addErrors(userErrors))
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

        // bcrypt user password
        const salt = await genSalt(10)
        sentUser.password = await hash(sentUser.password, salt)

        const savedUser = await userRepo.save(sentUser)

        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

        sign({ userId: savedUser.id },
            process.env[DotEnvKeys.JWT_SECRET],
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
        const body = req.body as User
        body.username = body.email // little gambiarra 

        const fieldErrors = validateUserFields(body)
        if (fieldErrors.length) {
            return res.status(400).json(new MyErrorsResponse().addErrors(fieldErrors))
        }

        let userRepo = getCustomRepository(UserRepository)

        // username or email exists ?
        let user = await userRepo.findOne({
            where: [
                { email: body.email },
                { username: body.email }]
        })
        if (!user) {
            return res.status(400).json(new MyErrorsResponse('Invalid email or username'))
        }

        // password is ok ?
        const passwordOk = await compare(body.password, user.password)
        if (!passwordOk) {
            return res.status(400).json(new MyErrorsResponse('Invalid password', 'password'))
        }

        // Signing in and returning  user's token 
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

        sign({ userId: user.id },
            process.env[DotEnvKeys.JWT_SECRET],
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

// PASSPORT  https://gist.githubusercontent.com/leannezhang/a24dd50f3eca44322d7ef3e4c365b9f0/raw/d6bfdab0e1366d56bd01a70db33d6f42b75ea88a/auth-routes.js

// // when login is successful, retrieve user info
// authRoute.get("/google/login/success", (req, res) => {
//     if (req.user) {
//         res.json({
//             success: true,
//             message: "user has successfully authenticated",
//             user: req.user,
//             cookies: req.cookies
//         });
//     }
// });

// // when login failed, send failed msg
// authRoute.get("/google/login/failed", (req, res) => {
//     res.status(401).json({
//         success: false,
//         message: "user failed to authenticate."
//     });
// });

// // When logout, redirect to client
// authRoute.get("/google/logout", (req, res) => {
//     req.logout();
//     res.redirect(process.env.CLIENT_BASE_URL);
// });

// // auth with google
// authRoute.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

// // redirect to home page after successfully login via twitter
// authRoute.get(
//     "/google/redirect",
//     passport.authenticate("google", {
//         successRedirect: process.env.CLIENT_BASE_URL,
//         failureRedirect: "/auth/google/login/failed"
//     })
// );

authRoute.get('/google/failed', (req, res) => res.send('You Failed to log in!'))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// In this route you can see that if the user is logged in u can access his info in: req.user
authRoute.get('/google/good', isLoggedIn, (req, res) => {

    return res.send(`Welcome mr ${req.user}!`)
})

// Auth Routes
authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoute.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        
        // Successful authentication, redirect home.
        
        res.redirect(process.env.CLIENT_BASE_URL);
    }
);

const addAllowCredentialsResponseHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_BASE_URL);
    res.header('Access-Control-Allow-Credentials', `true`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}

// 
authRoute.get('/google/login', [isLoggedIn, addAllowCredentialsResponseHeaders], async (req: Request, res: Response) => {
    try {
        const user = req.user as User

        // Signing in and returning  user's token 
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

        req.logout()
        sign({ userId: user.id },
            process.env[DotEnvKeys.JWT_SECRET],
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