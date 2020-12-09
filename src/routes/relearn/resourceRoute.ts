import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Resource } from '../../entity/relearn/Resource';
import authMiddleware from '../../middlewares/authMiddleware';
import ExpenseRepository from '../../repositories/ExpenseRepository';
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
        if (sentResource.id) {
            const isOwner = await resourceRepo.find({ id: sentResource.id, user })
            if (!isOwner) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this resource.`))
            }
        }

        sentResource.user = req.user
        sentResource.userId = req.user.id

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