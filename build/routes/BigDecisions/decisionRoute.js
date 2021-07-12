"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const DecisionRepository_1 = require("../../repositories/BigDecisions/DecisionRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const decisionRoute = express_1.Router();
const decisionRepo = typeorm_1.getCustomRepository(DecisionRepository_1.default);
decisionRoute.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        const allDecisions = await decisionRepo.getAllFromUser(req.user.id);
        return res.status(200).json(allDecisions);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
decisionRoute.post("/", authMiddleware_1.default, async (req, res) => {
    const sentDecision = req.body;
    const { user } = req;
    try {
        if (sentDecision.id) {
            // TODO
            // check ownership
            const decision = await decisionRepo.findOne({
                where: { id: sentDecision.id, userId: user.id },
            });
            if (!decision) {
                return res
                    .status(400)
                    .json(new ErrorMessage_1.MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`));
            }
        }
        sentDecision.userId = req.user.id;
        const saved = await decisionRepo.save(sentDecision);
        const fullSaved = await decisionRepo.getFullDecision(saved.id);
        // const allDecisions = await decisionRepo.getAllFromUser(req.user.id)
        return res.status(200).json(fullSaved);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = decisionRoute;
