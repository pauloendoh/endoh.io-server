import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Tag } from '../../entity/relearn/Tag';
import authMiddleware from '../../middlewares/authMiddleware';
import TagRepository from '../../repositories/relearn/TagRepository';
import ErrorMessage, { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const tagRoute = Router()

tagRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentTag = req.body as Tag 
    const tagRepo = getCustomRepository(TagRepository)
    const user = req.user

    try {
        if (sentTag.id) {
            const isOwner = await tagRepo.find({ id: sentTag.id, user })
            if (!isOwner) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this tag.`))
            }
        }

        sentTag.user = req.user
        sentTag.userId = req.user.id

        await tagRepo.save(sentTag)
        const tags = await tagRepo.getAllTagsFromUser(user)
        return res.status(200).json(tags)

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

tagRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const tagRepo = getCustomRepository(TagRepository)

    const user = req.user

    try {
        const tags = await tagRepo.getAllTagsFromUser(user)
        return res.json(tags)
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

export default tagRoute