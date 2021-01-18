import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import authMiddleware from '../../middlewares/authMiddleware';
import ProgressRepository from '../../repositories/skillbase/ProgressRepository';
import { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const progressRoute = Router()
const progressRepo = getCustomRepository(ProgressRepository)

progressRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const { user } = req

    try {
        const progresses = await progressRepo.getAllFromUser(user.id)
        return res.status(200).json(progresses)
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

progressRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const { user } = req
    const id = parseFloat(req.params.id)

    try {
        const result = await progressRepo.delete({ id, user })
        if (result.affected) {
            const progresses = await progressRepo.getAllFromUser(user.id)
            return res.status(200).json(progresses)
        }
        else {
            return res.status(400).json(new MyErrorsResponse('Progress not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }

})

export default progressRoute