
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Tag } from '../../entities/relearn/Tag';
import authMiddleware from '../../middlewares/authMiddleware';
import TagRepository from '../../repositories/relearn/TagRepository';
import { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const tagRoute = Router()

tagRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentTag = req.body as Tag
    const tagRepo = getCustomRepository(TagRepository)
    const user = req.user

    try {

        // checking ownership
        if (sentTag.id) {
            const isOwner = await tagRepo.find({ id: sentTag.id, user })
            if (!isOwner) {
                return res.status(400).json(new MyErrorsResponse(`User doesn't own this tag.`))
            }
        }

        // checking if tag name already exists 
        const nameExists = await tagRepo.findOne({ name: sentTag.name, user: req.user })
        if (nameExists) {
            return res.status(400).json(new MyErrorsResponse('Tag name must be unique.'))
        }

        sentTag.user = req.user
        sentTag.userId = req.user.id

        await tagRepo.save(sentTag)
        const tags = await tagRepo.getAllTagsFromUser(user)
        return res.status(200).json(tags)

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
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

tagRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const tagRepo = getCustomRepository(TagRepository)
    const { user } = req
    const tagId = parseFloat(req.params.id)

    try {
        const result = await tagRepo.delete({ id: tagId, user })
        if (result.affected) {
            return res.status(200).json(`Expense id=${tagId} deleted.`)
        }
        else {
            return res.status(400).json(new MyErrorsResponse('Tag id not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }

})



export default tagRoute