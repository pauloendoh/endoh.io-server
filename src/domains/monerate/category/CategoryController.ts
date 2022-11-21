import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import Category from "../../../entities/monerate/Category"
import { User } from "../../../entities/User"
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
          user,
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

  // PE 1/3 - not being used?
  @Delete("/:id")
  async deleteCategory(
    @CurrentUser({ required: true }) user: User,
    @Param("id") categoryId: number
  ) {
    const result = await this.categoryRepo.delete({
      id: categoryId,
      userId: user.id,
    })
    if (!result.affected)
      throw new BadRequestError("Category id not found, or user is not owner.")

    return this.categoryRepo.getCategoriesFromUser(user)
  }
}
