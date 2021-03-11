
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import authMiddleware from '../middlewares/authMiddleware';
import FollowingTagRepository from '../repositories/feed/FollowingTagRepository';
import UserSuggestionRepository from '../repositories/feed/UserSuggestionRepository';
import ResourceRepository from '../repositories/relearn/ResourceRepository';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';


const feedRoute = Router()

const userRepo = getCustomRepository(UserRepository)
const resourceRepo = getCustomRepository(ResourceRepository)
const followingTagsRepo = getCustomRepository(FollowingTagRepository)
const userSuggestionRepo = getCustomRepository(UserSuggestionRepository)

//  PE 2/3 
feedRoute.get('/my-user-suggestions', authMiddleware, async (req: MyAuthRequest, res) => {
    try {
        const userSuggestions = await userSuggestionRepo.getUserSuggestions(req.user)
        return res.json(userSuggestions)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

//  PE 2/3 
feedRoute.get('/resources', authMiddleware, async (req: MyAuthRequest, res) => {
    try {
        const feedResources = await followingTagsRepo.getFeedResources(req.user)
        return res.json(feedResources)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})


export default feedRoute