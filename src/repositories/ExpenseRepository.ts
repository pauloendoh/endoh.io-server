import { EntityRepository, Repository } from 'typeorm';
import { Expense } from '../entity/monerate/Expense';
import { User } from '../entity/User';

@EntityRepository(Expense)
export default class ExpenseRepository extends Repository<Expense>{

    async getAllExpensesFromUser(user: User): Promise<Expense[]> {
        return this.createQueryBuilder("decision")
            .where({ user })
            .leftJoinAndSelect('decision.place', 'place')
            .leftJoinAndSelect('decision.category', 'category')
            .orderBy("decision.createdAt", "DESC")
            .getMany()
    }

    // simple 'save()' was not returning 'createdAt' field... 
    async saveAndGetEntireModel(expense: Expense): Promise<Expense> {
        const savedExpense = await this.save(expense)
        return await this.findOne({
            where: { id: savedExpense.id },
            relations: ['category', 'place']
        })
    }
}