import { dataSource } from "../../dataSource"
import Category from "../../entities/monerate/Category"
import { User } from "../../entities/User"
import CategoryPostDto from "../../interfaces/dtos/monerate/Category/CategoryPostDto"

const CategoryRepository = dataSource.getRepository(Category).extend({
  async getCategoriesFromUser(user: User): Promise<Category[]> {
    return this.find({
      where: {
        userId: user.id,
      },
    })
  },
  async saveCategoryPostDto(
    category: CategoryPostDto,
    user: User
  ): Promise<Category> {
    return this.save({
      user: user,
      userId: user.id,
      name: category.name,
      bgColor: category.bgColor,
      icon: category.icon,
    })
  },
})

export default CategoryRepository
