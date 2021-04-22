"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const SkillProgress_1 = require("../../entities/skillbase/SkillProgress");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const SkillRepository_1 = require("../../repositories/skillbase/SkillRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const skillRoute = express_1.Router();
const skillRepo = typeorm_1.getCustomRepository(SkillRepository_1.default);
skillRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    try {
        const skills = await skillRepo.getAllFromUser(user.id);
        return res.status(200).json(skills);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
skillRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentSkill = req.body;
    const { user } = req;
    try {
        // checking ownership
        if (sentSkill.id) {
            const found = await skillRepo.findOne({ id: sentSkill.id, user });
            if (!found) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(`Now owner.`));
            }
            // criar progress 
            if (found.currentLevel > 0 &&
                (found.currentLevel < sentSkill.currentLevel)) {
                const newProgress = new SkillProgress_1.SkillProgress();
                newProgress.userId = user.id;
                newProgress.skillId = sentSkill.id;
                newProgress.oldLevel = found.currentLevel;
                newProgress.newLevel = sentSkill.currentLevel;
                newProgress.goalLevel = sentSkill.goalLevel;
                await typeorm_1.getRepository(SkillProgress_1.SkillProgress).save(newProgress);
            }
        }
        sentSkill.userId = req.user.id;
        await skillRepo.save(sentSkill);
        const allSkills = await skillRepo.getAllFromUser(user.id);
        return res.status(200).json(allSkills);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
skillRoute.put('/:id', authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    const skillId = Number(req.params['id']);
    const sentSkill = req.body;
    try {
        const isOwner = await skillRepo.findOne({ userId: user.id, id: skillId });
        if (isOwner) {
            sentSkill.id = skillId;
            const savedSkill = await skillRepo.save(sentSkill);
            return res.status(200).json(savedSkill);
        }
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("User is not owner or id doesn't exist"));
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
skillRoute.delete('/', authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    const { ids } = req.body;
    try {
        await skillRepo.deleteIdsFromUser(ids, user.id);
        const skills = await skillRepo.getAllFromUser(user.id);
        return res.status(200).json(skills);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = skillRoute;
//# sourceMappingURL=skillRoute.js.map