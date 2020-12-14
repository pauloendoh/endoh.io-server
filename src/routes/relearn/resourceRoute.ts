import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Resource } from '../../entity/relearn/Resource';
import authMiddleware from '../../middlewares/authMiddleware';
import ResourceRepository from '../../repositories/relearn/ResourceRepository';
import ErrorMessage, { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const resourceRoute = Router()

resourceRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentResource = req.body as Resource
    const resourceRepo = getCustomRepository(ResourceRepository)
    const user = req.user

    try {
        // If updating
        if (sentResource.id) {
            const previousResource = await resourceRepo.findOne({ id: sentResource.id, user }, {relations: ['tag']})

            // Check ownership
            if (!previousResource) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this resource.`))
            }

            // If adding a rating
            if (previousResource.rating === null && sentResource.rating > 0) {
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
                || (previousResource.tag.id != sentResource.tag.id)) // changing tag
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
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

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

// resourceRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
//     const expenseRepo = getCustomRepository(ExpenseRepository)
//     const { user } = req
//     const expenseId = parseFloat(req.params.id)

//     try {
//         const result = await expenseRepo.delete({ id: expenseId, user })
//         if (result.affected) {
//             return res.status(200).json(`Expense id=${expenseId} deleted.`)
//         }
//         else {
//             return res.status(400).json(new MyErrorsResponse('Expense id not found, or user is not owner.'))
//         }
//     }
//     catch (err) {
//         myConsoleError(err.message)
//         return res.status(400).json(new MyErrorsResponse(err.message))
//     }

// })

export default resourceRoute