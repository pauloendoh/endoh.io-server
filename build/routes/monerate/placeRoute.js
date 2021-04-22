"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const PlaceRepository_1 = require("../../repositories/monerate/PlaceRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const placeRoute = express_1.Router();
placeRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentPlace = req.body;
    const user = req.user;
    const placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
    try {
        if (sentPlace.id) {
            const results = await placeRepo.find({ id: sentPlace.id, user });
            if (!results.length) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('User is not owner of this place.'));
            }
        }
        await placeRepo.save({
            id: sentPlace.id,
            user: user,
            name: sentPlace.name,
            bgColor: sentPlace.bgColor,
            icon: sentPlace.icon
        });
        const places = await placeRepo.getPlacesFromUser(user);
        return res.json(places);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
placeRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
    const user = req.user;
    try {
        const places = await placeRepo.getPlacesFromUser(user);
        return res.json(places);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
placeRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
    const { user } = req;
    const placeId = parseFloat(req.params.id);
    try {
        const result = await placeRepo.delete({ id: placeId, user });
        if (result.affected) {
            const places = await placeRepo.getPlacesFromUser(user);
            return res.status(200).json(places);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Place id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = placeRoute;
//# sourceMappingURL=placeRoute.js.map