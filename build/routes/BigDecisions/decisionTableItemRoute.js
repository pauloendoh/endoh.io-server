"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const DecisionTableItem_1 = require("../../entities/BigDecisions/DecisionTableItem");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const itemRoute = express_1.Router();
const itemRepo = typeorm_1.getRepository(DecisionTableItem_1.DecisionTableItem);
itemRoute.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        // const allDecisions = await decisionRepo.getAllFromUser(req.user.id)
        // return res.status(200).json(allDecisions)
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
itemRoute.post("/", authMiddleware_1.default, async (req, res) => {
    const sentItem = req.body;
    const { user } = req;
    try {
        if (sentItem.id) {
            // TODO
            // check ownership
            const item = await itemRepo.findOne({
                where: { id: sentItem.id, userId: user.id },
            });
            if (!item) {
                return res
                    .status(400)
                    .json(new ErrorMessage_1.MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`));
            }
        }
        sentItem.userId = req.user.id;
        const saved = await itemRepo.save(sentItem);
        // const allDecisions = await itemRepo.getAllFromUser(req.user.id)
        return res.status(200).json(saved);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = itemRoute;
