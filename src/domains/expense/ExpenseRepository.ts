import { EntityRepository, Repository } from "typeorm";
import { Expense } from "../../entities/monerate/Expense";
import { User } from "../../entities/User";

@EntityRepository(Expense)
export default class ExpenseRepository extends Repository<Expense> {
  async getAllExpensesFromUser(user: User): Promise<Expense[]> {
    return this.createQueryBuilder("decision")
      .where({ user })
      .leftJoinAndSelect("decision.place", "place")
      .leftJoinAndSelect("decision.category", "category")
      .orderBy("decision.createdAt", "DESC")
      .getMany();
  }

  // simple 'save()' was not returning 'createdAt' field...
  async saveAndGetEntireModel(expense: Expense): Promise<Expense> {
    const savedExpense = await this.save(expense);
    return await this.findOne({
      where: { id: savedExpense.id },
      relations: ["category", "place"],
    });
  }

  async findSimilarExpenses(userId: number, value: number): Promise<Expense[]> {
    return this.query(
      `
      select e.* from 
        (select  e.id as id, abs($1 - e.value) as diff 
          from expense e where e.\"userId\" = $2 and e.value is not null order by diff limit 10)  closest
      inner join expense e on e.id = closest.id
      order by e.rating desc 
      `,
      [value, userId]
    );
  }
}
