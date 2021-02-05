import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import authMiddleware from '../middlewares/authMiddleware';
import ResourceRepository from '../repositories/relearn/ResourceRepository';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';

const userRoute = Router()

const userRepo = getCustomRepository(UserRepository)
const resourceRepo = getCustomRepository(ResourceRepository)

//  PE 2/3 
userRoute.get('/:username/rated-resources', authMiddleware, async (req: MyAuthRequest, res) => {
    const username = req.params['username']

    try {
        // username exists?
        const user = await userRepo.findOne({ username })

        const resources = await resourceRepo.getRatedResourcesFromUser(user)
        return res.json(resources)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})
export default userRoute