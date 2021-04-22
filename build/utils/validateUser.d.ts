import { User } from '../entities/User';
import { MyError } from './ErrorMessage';
declare const validateUser: (user: User) => MyError[];
export default validateUser;
