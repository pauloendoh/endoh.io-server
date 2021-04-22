"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const ProgressRepository_1 = require("../../repositories/skillbase/ProgressRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const progressRoute = express_1.Router();
const progressRepo = typeorm_1.getCustomRepository(ProgressRepository_1.default);
progressRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    try {
        const progresses = await progressRepo.getAllFromUser(user.id);
        return res.status(200).json(progresses);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
progressRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    const id = parseFloat(req.params.id);
    try {
        const result = await progressRepo.delete({ id, user });
        if (result.affected) {
            const progresses = await progressRepo.getAllFromUser(user.id);
            return res.status(200).json(progresses);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Progress not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = progressRoute;
