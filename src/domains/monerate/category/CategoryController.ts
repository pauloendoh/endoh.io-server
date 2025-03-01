import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from "routing-controllers"
import { User } from "../../../entities/User"
import Category from "../../../entities/monerate/Category"
import CategoryRepository from "../../../repositories/monerate/CategoryRepository"

@JsonController("/monerate/category")
export class CategoryController {
  constructor(private categoryRepo = CategoryRepository) {}

  @Post("/")
  async saveCategory(
    @CurrentUser({ required: true }) user: User,
    @Body() sentCategory: Category
  ) {
    if (sentCategory.id) {
      const results = await this.categoryRepo.find({
        where: {
          id: sentCategory.id,
          userId: user.id,
        },
      })
      if (!results.length) {
        throw new BadRequestError("User is not owner of this category.")
      }
    }

    await this.categoryRepo.save({
      id: sentCategory.id,
      user: user,
      name: sentCategory.name,
      bgColor: sentCategory.bgColor,
      icon: sentCategory.icon,
    })
    return this.categoryRepo.getCategoriesFromUser(user)
  }

  @Get("/")
  async getCategories(@CurrentUser({ required: true }) user: User) {
    return this.categoryRepo.getCategoriesFromUser(user)
  }
}
