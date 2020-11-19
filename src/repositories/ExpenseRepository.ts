import { EntityRepository, Repository } from 'typeorm';
import { Expense } from '../entity/Expense';
import { User } from '../entity/User';

@EntityRepository(Expense)
export default class ExpenseRepository extends Repository<Expense>{

    async getAllExpensesFromUser(user: User): Promise<Expense[]> {
        return this.createQueryBuilder("decision")
            .where({ user })
            .orderBy("decision.createdAt", "DESC")
            .getMany()
    }
}