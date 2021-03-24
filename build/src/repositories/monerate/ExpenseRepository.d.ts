import { Repository } from 'typeorm';
import { Expense } from '../../entities/monerate/Expense';
import { User } from '../../entities/User';
export default class ExpenseRepository extends Repository<Expense> {
    getAllExpensesFromUser(user: User): Promise<Expense[]>;
    saveAndGetEntireModel(expense: Expense): Promise<Expense>;
}
