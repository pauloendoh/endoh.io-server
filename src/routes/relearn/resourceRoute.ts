import { Router } from 'express';
import { getCustomRepository, In } from 'typeorm';
import { Resource } from '../../entities/relearn/Resource';
import authMiddleware from '../../middlewares/authMiddleware';
import ResourceRepository from '../../repositories/relearn/ResourceRepository';
import { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const resourceRoute = Router()

// PE 1/3 - it's getting way too slow 
resourceRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentResource = req.body as Resource
    const resourceRepo = getCustomRepository(ResourceRepository)
    const user = req.user

    try {
        // If updating
        if (sentResource.id) {
            const previousResource = await resourceRepo.findOne({ id: sentResource.id, user }, { relations: ['tag'] })

            // Check ownership
            if (!previousResource) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this resource.`))
            }

            // If adding a rating
            if ((previousResource.rating === null || previousResource.rating === 0) && sentResource.rating > 0) {
                await resourceRepo
                    .reducePosition(sentResource.tag, user, sentResource.position + 1)

                sentResource.completedAt = new Date().toISOString()
                sentResource.position = null

                // TODO: reduce by 1 the others' positions

            }
            // If removing a rating 
            else if ((previousResource.rating > 0 && sentResource.rating === null)) {
                sentResource.completedAt = ''
                sentResource.position = await resourceRepo.getLastPosition(sentResource.tag, user)
            }

            if (
                ((previousResource.tag === null && sentResource.tag !== null) // adding tag
                    || (previousResource.tag !== null && sentResource.tag === null) // removing tag
                    || (previousResource.tag?.id != sentResource.tag?.id)) // changing tag
                && previousResource.position) {
                await resourceRepo
                    .reducePosition(previousResource.tag, user, previousResource.position + 1)

                sentResource.position = await resourceRepo
                    .getLastPosition(sentResource.tag, user)
            }

        }
        else {
            // if adding resource, check tag's last resource's position
            sentResource.position = await resourceRepo.getLastPosition(sentResource.tag, user)

            sentResource.user = user
            sentResource.userId = user.id
        }

        await resourceRepo.save(sentResource)
        const resources = await resourceRepo.getAllResourcesFromUser(user)
        return res.status(200).json(resources)
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})


//  PE 2/3 
resourceRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const resourceRepo = getCustomRepository(ResourceRepository)

    const user = req.user

    try {
        const resources = await resourceRepo.getAllResourcesFromUser(user)
        return res.json(resources)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

// PE 2/3 
resourceRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const resourceRepo = getCustomRepository(ResourceRepository)
    const { user } = req
    const resourceId = parseFloat(req.params.id)

    try {
        const result = await resourceRepo.delete({ id: resourceId, user })
        if (result.affected) {
            return res.status(200).json(`Expense id=${resourceId} deleted.`)
        }
        else {
            return res.status(400).json(new MyErrorsResponse('Resource id not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }

})

// PE 2/3 
resourceRoute.post('/resources', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentResources = req.body as Resource[]
    const user = req.user
    const resourceRepo = getCustomRepository(ResourceRepository)

    try {
        // verifying if resources are from the auth user 


        const verifiedResources = await resourceRepo
            .find({
                where: {
                    id: In(sentResources.map(r => r.id)),
                    userId: user.id
                }
            })


        if (verifiedResources.length !== sentResources.length) {
            return res.status(400).json(new MyErrorsResponse("User does not own all sent resources."))
        }

        await resourceRepo.save(sentResources)
        return res.status(200).json("Saved")
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

// PE 2/3 
resourceRoute.post('/duplicate/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const resourceRepo = getCustomRepository(ResourceRepository)
    const { user } = req
    const resourceId = parseFloat(req.params.id)

    try {
        const resource = await resourceRepo.findOne({
            where: { id: resourceId, user }
        })
        if (resource) {
            if (resource.completedAt.length > 0) {
                return res.status(400).json(new MyErrorsResponse("Can't duplicate completed resources."))
            }

            // empurra todos após o :id
            await resourceRepo.increasePositionByOne(resource.tagId, user, resource.position + 1)

            // insere uma cópia na próxima posição
            await resourceRepo.save({ ...resource, id: null, position: resource.position + 1, createdAt: undefined, updatedAt: undefined })

            // retorna todos os resources
            const resources = await resourceRepo.getAllResourcesFromUser(user)
            return res.status(200).json(resources)

        }
        else {
            return res.status(400).json(new MyErrorsResponse('Resource id not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }

})

export default resourceRoute