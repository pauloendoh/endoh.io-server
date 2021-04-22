"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const ExpenseRepository_1 = require("../../repositories/monerate/ExpenseRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const expenseRoute = express_1.Router();
expenseRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentExpense = req.body; // should be ExpensePostDto ?
    const expenseRepo = typeorm_1.getCustomRepository(ExpenseRepository_1.default);
    const user = req.user;
    try {
        if (sentExpense.id) {
            const isOwner = await expenseRepo.find({ id: sentExpense.id, user });
            if (!isOwner) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(`User doesn't own this expense.z`));
            }
        }
        sentExpense.user = req.user;
        sentExpense.userId = req.user.id;
        const savedExpense = await expenseRepo.saveAndGetEntireModel(sentExpense);
        return res.status(200).json(savedExpense);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
expenseRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const expenseRepo = typeorm_1.getCustomRepository(ExpenseRepository_1.default);
    const user = req.user;
    try {
        const expenses = await expenseRepo.getAllExpensesFromUser(user);
        return res.json(expenses);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
expenseRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const expenseRepo = typeorm_1.getCustomRepository(ExpenseRepository_1.default);
    const { user } = req;
    const expenseId = parseFloat(req.params.id);
    try {
        const result = await expenseRepo.delete({ id: expenseId, user });
        if (result.affected) {
            return res.status(200).json(`Expense id=${expenseId} deleted.`);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Expense id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = expenseRoute;
