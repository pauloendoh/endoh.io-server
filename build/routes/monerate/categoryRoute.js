"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const CategoryRepository_1 = require("../../repositories/monerate/CategoryRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const categoryRoute = express_1.Router();
categoryRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentCategory = req.body;
    const user = req.user;
    const categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
    try {
        if (sentCategory.id) {
            const results = await categoryRepo.find({ id: sentCategory.id, user });
            if (!results.length) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('User is not owner of this category.'));
            }
        }
        await categoryRepo.save({
            id: sentCategory.id,
            user: user,
            name: sentCategory.name,
            bgColor: sentCategory.bgColor,
            icon: sentCategory.icon
        });
        const categories = await categoryRepo.getCategoriesFromUser(user);
        return res.json(categories);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
categoryRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
    const user = req.user;
    try {
        const categories = await categoryRepo.getCategoriesFromUser(user);
        return res.json(categories);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
categoryRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
    const { user } = req;
    const categoryId = parseFloat(req.params.id);
    try {
        const result = await categoryRepo.delete({ id: categoryId, user });
        if (result.affected) {
            const categories = await categoryRepo.getCategoriesFromUser(user);
            return res.status(200).json(categories);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Category id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = categoryRoute;
