import { Repository } from 'typeorm';
import CategoryPostDto from '../../interfaces/dtos/monerate/Category/CategoryPostDto';
import Category from '../../entities/monerate/Category';
import { User } from '../../entities/User';
export default class CategoryRepository extends Repository<Category> {
    getCategoriesFromUser(user: User): Promise<Category[]>;
    saveCategoryPostDto(category: CategoryPostDto, user: User): Promise<Category>;
}
