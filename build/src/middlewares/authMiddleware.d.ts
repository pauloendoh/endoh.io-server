import { NextFunction, Response } from 'express';
import { MyAuthRequest } from '../utils/MyAuthRequest';
export default function authMiddleware(req: MyAuthRequest, res: Response, next: NextFunction): Response<any>;
