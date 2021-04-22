"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const TagRepository_1 = require("../../repositories/relearn/TagRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const tagRoute = express_1.Router();
tagRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentTag = req.body;
    const tagRepo = typeorm_1.getCustomRepository(TagRepository_1.default);
    const user = req.user;
    try {
        // trimming tag.name
        sentTag.name = sentTag.name.trim();
        // checking ownership
        if (sentTag.id) {
            const isOwner = await tagRepo.find({ id: sentTag.id, user });
            if (!isOwner) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(`User doesn't own this tag.`));
            }
        }
        else {
            // checking if tag name already exists 
            const nameExists = await tagRepo.findOne({ name: sentTag.name, user: req.user });
            if (nameExists) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Tag name must be unique.'));
            }
        }
        sentTag.user = req.user;
        sentTag.userId = req.user.id;
        await tagRepo.save(sentTag);
        const tags = await tagRepo.getAllTagsFromUser(user);
        return res.status(200).json(tags);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
tagRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const tagRepo = typeorm_1.getCustomRepository(TagRepository_1.default);
    const user = req.user;
    try {
        const tags = await tagRepo.getAllTagsFromUser(user);
        return res.json(tags);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
tagRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const tagRepo = typeorm_1.getCustomRepository(TagRepository_1.default);
    const { user } = req;
    const tagId = parseFloat(req.params.id);
    try {
        const result = await tagRepo.delete({ id: tagId, user });
        if (result.affected) {
            return res.status(200).json(`Tag id=${tagId} deleted.`);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Tag id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = tagRoute;
