"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Doc_1 = require("../../entities/define/Doc");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const DocRepository_1 = require("../../repositories/define/DocRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const docRoute = express_1.Router();
const docRepository = typeorm_1.getCustomRepository(DocRepository_1.default);
docRoute.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        const allDocs = await docRepository.getAllDocsFromUserId(req.user.id);
        return res.status(200).json(allDocs);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
docRoute.post("/", authMiddleware_1.default, async (req, res) => {
    const sentDoc = req.body;
    const { user } = req;
    try {
        if (sentDoc.id) {
            // TODO
            // check ownership
            const doc = await docRepository.findOne({
                where: { id: sentDoc.id, userId: user.id },
            });
            if (!doc) {
                return res
                    .status(400)
                    .json(new ErrorMessage_1.MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`));
            }
            doc.title = sentDoc.title;
            const savedDoc = await docRepository.save(doc);
            return res.status(200).json(savedDoc);
        }
        else {
            const newDoc = new Doc_1.Doc();
            newDoc.title = sentDoc.title;
            newDoc.userId = user.id;
            const savedDoc = await docRepository.save(newDoc);
            return res.status(200).json(savedDoc);
        }
        // const allUserDocs = await docRepository.getAllDocsFromUserId(user.id)
        // return res.status(200).json(allUserDocs)
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = docRoute;
