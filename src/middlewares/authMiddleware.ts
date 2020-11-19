import { DotEnvNames } from './../consts/dotenv';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';

export default function authMiddleware(req: MyAuthRequest, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token')

    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied!' })

    // Verify token
    try {
        verify(token, process.env[DotEnvNames.JWT_SECRET], async (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req.user = await getCustomRepository(UserRepository)
                    .findOne({
                        id: decoded['userId']
                    })

                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}