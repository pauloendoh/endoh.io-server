import { getCustomRepository } from "typeorm";
import ExpenseRepository from "./ExpenseRepository";

export class ExpenseService {
  constructor(private expenseRepo = getCustomRepository(ExpenseRepository)) {}

  findSimilarExpenses(userId: number, value: number) {
    return this.expenseRepo.findSimilarExpenses(userId, value);
  }
}
