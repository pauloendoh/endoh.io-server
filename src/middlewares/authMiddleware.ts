import { NextFunction, Response } from 'express';
import { verify as validateJwt } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { DotEnvKeys } from '../enums/DotEnvKeys';

// PE 2/3 
export default function authMiddleware(req: MyAuthRequest, res: Response, next: NextFunction) {
    const authToken = req.header('x-auth-token')

    if (!authToken)
        return res.status(401).json(new MyErrorsResponse('No token, authorization denied! Sign in and try again.'))

    // Verify token
    try {
        validateJwt(
            authToken,
            process.env[DotEnvKeys.JWT_SECRET],
            async (error, decodedObj) => {
                if (error) {
                    return res.status(401).json({ msg: 'Token is not valid. Sign in and try again.' });
                }
                else {
                    req.user = await getCustomRepository(UserRepository)
                        .findOne({ id: decodedObj['userId'] })
                    next();
                }
            });
    } catch (err) {

        res.status(500).json(new MyErrorsResponse('Server Error'));
    }
}