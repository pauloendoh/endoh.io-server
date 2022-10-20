import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers"
import { Expense } from "../../../entities/monerate/Expense"
import { User } from "../../../entities/User"
import { MyAuthMiddleware } from "../../../middlewares/MyAuthMiddleware"
import { MyAuthRequest } from "../../../utils/MyAuthRequest"
import ExpenseRepository from "./ExpenseRepository"
import { ExpenseService } from "./ExpenseService"

@JsonController()
export class ExpenseController {
  constructor(
    private expenseService = new ExpenseService(),
    private expenseRepo = ExpenseRepository
  ) {}

  @Get("/expenses/similar-expenses")
  getSimilarExpenses(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Res() response: any,
    @QueryParam("value", { required: true }) value: number
  ) {
    return this.expenseService.findSimilarExpenses(req.user.id, value)
  }

  @Post("/monerate/expense")
  async saveExpense(
    @CurrentUser({ required: true }) user: User,
    @Body() sentExpense: Expense
  ) {
    if (sentExpense.id) {
      const isOwner = await this.expenseRepo.find({
        where: {
          id: sentExpense.id,
          user,
        },
      })
      if (!isOwner) {
        throw new BadRequestError("User does not own this expense.")
      }
    }

    sentExpense.user = user
    sentExpense.userId = user.id

    return this.expenseRepo.saveAndGetEntireModel(sentExpense)
  }

  @Get("/monerate/expense")
  async getExpenses(
    @CurrentUser({ required: true }) user: User,
    @Body() sentExpense: Expense
  ) {
    return this.expenseRepo.getAllExpensesFromUser(user)
  }

  @Delete("/monerate/expense/:id")
  async deleteExpense(
    @CurrentUser({ required: true }) user: User,
    @Param("id") expenseId: number
  ) {
    const result = await this.expenseRepo.delete({ id: expenseId, user })
    if (!result.affected) {
      throw new BadRequestError("Expense id not found, or user is not owner.")
    }
    return `Expense id=${expenseId} deleted.`
  }
}
