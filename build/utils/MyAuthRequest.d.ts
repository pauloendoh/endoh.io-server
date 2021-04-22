import { Request } from 'express';
import { User } from '../entities/User';
export interface MyAuthRequest extends Request {
    user: User;
}
