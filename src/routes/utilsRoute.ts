import * as dotenv from 'dotenv';
import { Router } from 'express';
import fetch from 'node-fetch';
import { getCustomRepository } from 'typeorm';
import { EmailPostDto } from '../interfaces/dtos/auth/EmailPostDto';
import { LinkPreviewDto } from '../interfaces/dtos/relearn/LinkPreviewDto';
import authMiddleware from '../middlewares/authMiddleware';
import UserRepository from '../repositories/UserRepository';
import { isValidEmail } from '../utils/email/isValidEmail';
import { sendPasswordResetEmail } from '../utils/email/sendPasswordResetEmail';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { isValidUrl } from '../utils/isValidUrl';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';
dotenv.config()

const utilsRoute = Router()
const userRepo = getCustomRepository(UserRepository)

utilsRoute.get('/link-preview',
    authMiddleware,
    async (req: MyAuthRequest, res) => {
        const url = req.query['url'] as string

        if (!isValidUrl(url)) {
            return res.status(400).json(new MyErrorsResponse('URL is not valid', 'url'))
        }

        try {
            fetch('http://api.linkpreview.net/?key=' + process.env.LINK_PREVIEW_KEY + '&q=' + url)
                .then(res => res.json())
                .then(json => {
                    const linkPreview = json as LinkPreviewDto
                    return res.status(200).json(linkPreview)
                })
        }
        catch (err) {
            myConsoleError(err.message)
            return res.status(400).json(new MyErrorsResponse(err.message))
        }
    })


utilsRoute.post('/passwordResetEmail',
    async (req, res) => {
        try {
            const { email } = req.body as EmailPostDto
            if (!isValidEmail(email)) {
                return res.sendStatus(400).json(new MyErrorsResponse("This is not an email lol"))
            }

            const registeredUser = await userRepo.findOne({ email })
            if (!registeredUser) {
                return res.sendStatus(200)
            }

            // sending email 
            sendPasswordResetEmail(registeredUser)
            return res.sendStatus(200)
        }
        catch (err) {
            myConsoleError(err.message)
            return res.sendStatus(400).json(new MyErrorsResponse(err.message))
        }
    })

export default utilsRoute