import { EntityRepository, Repository } from 'typeorm';
import CategoryPostDto from '../../interfaces/dtos/monerate/Category/CategoryPostDto';
import Category from '../../entities/monerate/Category';
import { User } from '../../entities/User';

@EntityRepository(Category)
export default class CategoryRepository extends Repository<Category>{
    async getCategoriesFromUser(user: User): Promise<Category[]> {
        return this.find({ userId: user.id })
    }

    async saveCategoryPostDto(category: CategoryPostDto, user: User): Promise<Category> {
        return this.save({
            user: user,
            userId: user.id,
            name: category.name,
            bgColor: category.bgColor,
            icon: category.icon
        })
    }
}