import { User } from '../User';
import Category from './Category';
import Place from './Place';
export declare class Expense {
    id: number;
    user: User;
    userId: number;
    description: string;
    name: string;
    rating: number;
    value: number;
    createdAt: string;
    updatedAt: string;
    place: Place;
    placeId: number;
    category: Category;
    categoryId: number;
}
