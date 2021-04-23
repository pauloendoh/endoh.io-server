import { LolRate } from '../entities/LolRate';

import { Router } from 'express';
import { getConnection, getCustomRepository, getRepository } from 'typeorm';
import FollowingTagRepository from '../repositories/feed/FollowingTagRepository';
import UserSuggestionRepository from '../repositories/feed/UserSuggestionRepository';
import ResourceRepository from '../repositories/relearn/ResourceRepository';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';

const lolRatesRoute = Router()

const userRepo = getCustomRepository(UserRepository)
const resourceRepo = getCustomRepository(ResourceRepository)
const followingTagsRepo = getCustomRepository(FollowingTagRepository)
const userSuggestionRepo = getCustomRepository(UserSuggestionRepository)

//  PE 2/3 
lolRatesRoute.get('/', async (req, res) => {
    try {
        const connection = getConnection()
        const results = await getRepository(LolRate).find()
        return res.json(results)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})



export default lolRatesRoute