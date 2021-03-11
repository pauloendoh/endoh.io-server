
import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { FollowTagDto } from '../dtos/feed/FollowTagDto';
import { newUserInfo, UserInfoDto } from '../dtos/UserInfoDto';
import { FollowingTag } from '../entities/feed/FollowingTag';
import { Profile } from '../entities/feed/Profile';
import { Tag } from '../entities/relearn/Tag';
import authMiddleware from '../middlewares/authMiddleware';
import FollowingTagRepository from '../repositories/feed/FollowingTagRepository';
import ResourceRepository from '../repositories/relearn/ResourceRepository';
import UserRepository from '../repositories/UserRepository';
import { MyErrorsResponse } from '../utils/ErrorMessage';
import { MyAuthRequest } from '../utils/MyAuthRequest';
import { myConsoleError } from '../utils/myConsoleError';


const userRoute = Router()

const userRepo = getCustomRepository(UserRepository)
const resourceRepo = getCustomRepository(ResourceRepository)
const followingTagsRepo = getCustomRepository(FollowingTagRepository)

//  PE 2/3 
userRoute.get('/:username/all', authMiddleware, async (req: MyAuthRequest, res) => {
    const username = req.params['username']

    const userInfo: UserInfoDto = newUserInfo()

    try {
        // username exists?
        const user = await userRepo.findOne({ username })

        // get all resources (if req.user === user); otherwise, just get from public lists
        userInfo.resources = await resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id)

        // profile
        userInfo.profile = await getRepository(Profile).findOne({ userId: user.id })

        // public lists
        userInfo.publicLists = await getRepository(Tag).find({ userId: user.id, isPrivate: false })

        // private tags
        if (user.id === req.user.id) {
            userInfo.privateLists = await getRepository(Tag).find({ userId: user.id, isPrivate: true })
        }

        // following users 
        userInfo.followingUsers = await followingTagsRepo.getFollowingUsers(user)

        // following users 
        userInfo.followers = await followingTagsRepo.getFollowers(user)

        return res.json(userInfo)

    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

//  PE 2/3 
userRoute.get('/:username/rated-resources', authMiddleware, async (req: MyAuthRequest, res) => {
    const username = req.params['username']

    try {
        // username exists?
        const user = await userRepo.findOne({ username })

        const resources = await resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id)
        return res.json(resources)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

//  PE 2/3 
userRoute.put('/profile', authMiddleware, async (req: MyAuthRequest, res) => {
    const username = req.params['username']
    const profile: Profile = req.body

    try {
        const savedProfile = await getRepository(Profile).save(profile)
        return res.json(savedProfile)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

userRoute.post('/:username/followingTags', authMiddleware, async (req: MyAuthRequest, res) => {
    try {
        const username = req.params['username']
        const tags = req.body as FollowTagDto[]

        const repo = getRepository(FollowingTag)

        // username exists?
        const user = await userRepo.findOne({ username })

        // saving all following tags 
        // PE 1/3 - separar isso em um FollowingTagRepository
        for (const tag of tags) {
            if (tag.isFollowing) {
                const found = await repo.findOne({
                    follower: req.user,
                    followingUser: user,
                    tagId: tag.tagId
                })

                if (!found) {
                    await repo.save({
                        follower: req.user,
                        followingUser: user,
                        tagId: tag.tagId
                    })
                }
            }
            else {
                await repo.delete({

                    follower: req.user,
                    followingUser: user,
                    tagId: tag.tagId
                })
            }
        }

        const userFollowingTags = await repo.find({ where: { follower: req.user } })
        return res.json(userFollowingTags)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

//  PE 2/3 
userRoute.get('/:username/followingTags', authMiddleware, async (req: MyAuthRequest, res) => {
    const username = req.params['username']

    try {
        // username exists?
        const user = await userRepo.findOne({ username })

        const followingTags = await followingTagsRepo.find({ where: { follower: user } })
        return res.json(followingTags)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

export default userRoute