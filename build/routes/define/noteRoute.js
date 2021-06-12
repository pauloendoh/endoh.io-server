"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const NoteRepository_1 = require("../../repositories/define/NoteRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const noteRoute = express_1.Router();
const noteRepo = typeorm_1.getCustomRepository(NoteRepository_1.default);
noteRoute.get("/", authMiddleware_1.default, async (req, res) => {
    try {
        const allNotes = await noteRepo.getAllNotesFromUserId(req.user.id);
        return res.status(200).json(allNotes);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
noteRoute.post("/", authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    const sentNote = req.body;
    try {
        if (sentNote.id) {
            //ownership
            const found = await noteRepo.findOne({
                where: { userId: user.id, id: sentNote.id },
            });
            if (!found)
                return res
                    .status(400)
                    .json(new ErrorMessage_1.MyErrorsResponse("Note doesn't exist or user is not owner"));
        }
        const savedNote = await noteRepo.save(sentNote);
        return res.status(200).json(savedNote);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
noteRoute.post("/many", authMiddleware_1.default, async (req, res) => {
    const { user } = req;
    const sentNotes = req.body;
    try {
        const isOwner = await noteRepo.isOwner(sentNotes, user.id);
        if (!isOwner)
            return res
                .status(400)
                .json(new ErrorMessage_1.MyErrorsResponse("User is not owner of all notes."));
        await noteRepo.save(sentNotes);
        const allNotes = await noteRepo.getAllNotesFromUserId(user.id);
        return res.status(200).json(allNotes);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = noteRoute;
