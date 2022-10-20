import ExpenseRepository from "./ExpenseRepository"

export class ExpenseService {
  constructor(private expenseRepo = ExpenseRepository) {}

  findSimilarExpenses(userId: number, value: number) {
    return this.expenseRepo.findSimilarExpenses(userId, value)
  }
}
