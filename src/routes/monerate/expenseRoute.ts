import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Expense } from '../../entity/monerate/Expense';
import authMiddleware from '../../middlewares/authMiddleware';
import ExpenseRepository from '../../repositories/ExpenseRepository';
import ErrorMessage from '../../utils/ErrorMessage';
import { myConsoleError } from '../../utils/myConsoleError';
import { MyAuthRequest } from './../../utils/MyAuthRequest';


const expenseRoute = Router()

expenseRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentExpense = req.body as Expense // should be ExpensePostDto ?
    const expenseRepo = getCustomRepository(ExpenseRepository)

    try {
        sentExpense.user = req.user
        sentExpense.userId = req.user.id

        const savedExpense = await expenseRepo.saveAndGetEntireModel(sentExpense)
        return res.status(200).json(savedExpense)
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

expenseRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const expenseRepo = getCustomRepository(ExpenseRepository)

    const user = req.user

    try {
        const expenses = await expenseRepo.getAllExpensesFromUser(user)
        return res.json(expenses)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

export default expenseRoute