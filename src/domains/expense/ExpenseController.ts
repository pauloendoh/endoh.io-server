import {
  Get,
  JsonController,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { MyAuthMiddleware } from "../../middlewares/MyAuthMiddleware";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { ExpenseService } from "./ExpenseService";

@JsonController()
export class ExpenseController {
  constructor(private expenseService = new ExpenseService()) {}

  @Get("/expenses/similar-expenses")
  getSimilarExpenses(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Res() response: any,
    @QueryParam("value", { required: true }) value: number
  ) {
    return this.expenseService.findSimilarExpenses(req.user.id, value);
  }
}
