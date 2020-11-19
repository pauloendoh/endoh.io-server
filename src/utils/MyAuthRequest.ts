import { Request } from 'express';
import { User } from '../entity/User';

//
export interface MyAuthRequest  extends Request {
    user: User
}