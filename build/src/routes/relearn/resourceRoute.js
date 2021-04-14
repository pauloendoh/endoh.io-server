"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const NotificationRepository_1 = require("../../repositories/feed/NotificationRepository");
const ResourceRepository_1 = require("../../repositories/relearn/ResourceRepository");
const ErrorMessage_1 = require("../../utils/ErrorMessage");
const myConsoleError_1 = require("../../utils/myConsoleError");
const resourceRoute = express_1.Router();
// PE 1/3 - it's getting way too slow 
resourceRoute.post('/', authMiddleware_1.default, async (req, res) => {
    const sentResource = req.body;
    const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const user = req.user;
    try {
        // If user saved from another user 
        if (sentResource.fromResourceId) {
            typeorm_1.getCustomRepository(NotificationRepository_1.default)
                .createSavedResourceNotification(user.id, sentResource.fromResourceId);
        }
        // If updating
        if (sentResource.id) {
            const previousResource = await resourceRepo.findOne({ id: sentResource.id, user }, { relations: ['tag'] });
            // Check ownership
            if (!previousResource) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(`User doesn't own this resource.`));
            }
            // If adding a rating
            if ((previousResource.rating === null || previousResource.rating === 0) && sentResource.rating > 0) {
                await resourceRepo
                    .reducePosition(sentResource.tag, user, sentResource.position + 1);
                sentResource.completedAt = new Date().toISOString();
                sentResource.position = null;
                // TODO: reduce by 1 the others' positions
            }
            // If removing a rating 
            else if ((previousResource.rating > 0 && sentResource.rating === null)) {
                sentResource.completedAt = '';
                sentResource.position = await resourceRepo.getLastPosition(sentResource.tag, user);
            }
            if (((previousResource.tag === null && sentResource.tag !== null) // adding tag
                || (previousResource.tag !== null && sentResource.tag === null) // removing tag
                || (previousResource.tag?.id != sentResource.tag?.id)) // changing tag
                && previousResource.position) {
                await resourceRepo
                    .reducePosition(previousResource.tag, user, previousResource.position + 1);
                sentResource.position = await resourceRepo
                    .getLastPosition(sentResource.tag, user);
            }
        }
        else {
            // if adding resource, check tag's last resource's position
            sentResource.position = await resourceRepo.getLastPosition(sentResource.tag, user);
            sentResource.userId = user.id;
        }
        await resourceRepo.save(sentResource);
        const resources = await resourceRepo.getAllResourcesFromUser(user);
        return res.status(200).json(resources);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
//  PE 2/3 
resourceRoute.get('/', authMiddleware_1.default, async (req, res) => {
    const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const user = req.user;
    try {
        const resources = await resourceRepo.getAllResourcesFromUser(user);
        return res.json(resources);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 2/3 
resourceRoute.delete('/:id', authMiddleware_1.default, async (req, res) => {
    const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const { user } = req;
    const resourceId = parseFloat(req.params.id);
    try {
        const result = await resourceRepo.delete({ id: resourceId, user });
        if (result.affected) {
            return res.status(200).json(`Expense id=${resourceId} deleted.`);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Resource id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 2/3 
resourceRoute.post('/resources', authMiddleware_1.default, async (req, res) => {
    const sentResources = req.body;
    const user = req.user;
    const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    try {
        // verifying if resources are from the auth user 
        const verifiedResources = await resourceRepo
            .find({
            where: {
                id: typeorm_1.In(sentResources.map(r => r.id)),
                userId: user.id
            }
        });
        if (verifiedResources.length !== sentResources.length) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("User does not own all sent resources."));
        }
        await resourceRepo.save(sentResources);
        return res.status(200).json("Saved");
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 2/3 
resourceRoute.post('/duplicate/:id', authMiddleware_1.default, async (req, res) => {
    const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const { user } = req;
    const resourceId = parseFloat(req.params.id);
    try {
        const resource = await resourceRepo.findOne({
            where: { id: resourceId, user }
        });
        if (resource) {
            if (resource.completedAt.length > 0) {
                return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Can't duplicate completed resources."));
            }
            // empurra todos após o :id
            await resourceRepo.increasePositionByOne(resource.tagId, user, resource.position + 1);
            // insere uma cópia na próxima posição
            await resourceRepo.save({ ...resource, id: null, position: resource.position + 1, createdAt: undefined, updatedAt: undefined });
            // retorna todos os resources
            const resources = await resourceRepo.getAllResourcesFromUser(user);
            return res.status(200).json(resources);
        }
        else {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Resource id not found, or user is not owner.'));
        }
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = resourceRoute;
//# sourceMappingURL=resourceRoute.js.map