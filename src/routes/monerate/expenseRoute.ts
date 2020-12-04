import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Expense } from '../../entity/monerate/Expense';
import authMiddleware from '../../middlewares/authMiddleware';
import ExpenseRepository from '../../repositories/ExpenseRepository';
import ErrorMessage, { MyErrorsResponse } from '../../utils/ErrorMessage';
import { myConsoleError } from '../../utils/myConsoleError';
import { MyAuthRequest } from './../../utils/MyAuthRequest';


const expenseRoute = Router()

expenseRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentExpense = req.body as Expense // should be ExpensePostDto ?
    const expenseRepo = getCustomRepository(ExpenseRepository)
    const user = req.user

    try {
        if (sentExpense.id) {
            const isOwner = await expenseRepo.find({ id: sentExpense.id, user })
            if (!isOwner) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this expense.z`))
            }
        }

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
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

expenseRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const expenseRepo = getCustomRepository(ExpenseRepository)
    const { user } = req
    const expenseId = parseFloat(req.params.id)

    try {
        const result = await expenseRepo.delete({ id: expenseId, user })
        if (result.affected) {
            return res.status(200).json(`Expense id=${expenseId} deleted.`)
        }
        else {
            return res.status(400).json(new MyErrorsResponse('Expense id not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }

})

export default expenseRoute