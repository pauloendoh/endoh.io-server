import { User } from '../User';
import { Expense } from './Expense';
export default class Category {
    id: number;
    user: User;
    userId: number;
    name: string;
    icon: string;
    bgColor: string;
    createdAt: string;
    updatedAt: string;
    expenses: Expense[];
}
