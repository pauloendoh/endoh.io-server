import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { IdsDto } from '../../dtos/IdsDto';
import { Skill } from '../../entities/skillbase/Skill';
import { SkillProgress } from '../../entities/skillbase/SkillProgress';
import authMiddleware from '../../middlewares/authMiddleware';
import SkillRepository from '../../repositories/skillbase/SkillRepository';
import { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const skillRoute = Router()
const skillRepo = getCustomRepository(SkillRepository)

skillRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const { user } = req

    try {
        const skills = await skillRepo.getAllFromUser(user.id)
        return res.status(200).json(skills)
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

skillRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentSkill = req.body as Skill
    const { user } = req

    try {

        // checking ownership
        if (sentSkill.id) {
            const found = await skillRepo.findOne({ id: sentSkill.id, user })
            if (!found) {
                return res.status(400).json(new MyErrorsResponse(`Now owner.`))
            }

            // criar progress 
            if (found.currentLevel > 0 &&
                (found.currentLevel < sentSkill.currentLevel)) {

                const newProgress = new SkillProgress()
                newProgress.userId = user.id
                newProgress.skillId = sentSkill.id
                newProgress.oldLevel = found.currentLevel
                newProgress.newLevel = sentSkill.currentLevel

                await getRepository(SkillProgress).save(newProgress)
            }
        }

        sentSkill.userId = req.user.id

        await skillRepo.save(sentSkill)

        const allSkills = await skillRepo.getAllFromUser(user.id)
        return res.status(200).json(allSkills)

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})


skillRoute.put('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const { user } = req
    const skillId = Number(req.params['id'])

    const sentSkill = req.body as Skill

    try {
        const isOwner = await skillRepo.findOne({ userId: user.id, id: skillId })
        if (isOwner) {
            sentSkill.id = skillId

            const savedSkill = await skillRepo.save(sentSkill)
            return res.status(200).json(savedSkill)
        }

        return res.status(400).json(new MyErrorsResponse("User is not owner or id doesn't exist"))

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})

skillRoute.delete('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const { user } = req

    const { ids } = req.body as IdsDto


    try {
        await skillRepo.deleteIdsFromUser(ids, user.id)
        const skills = await skillRepo.getAllFromUser(user.id)

        return res.status(200).json(skills)

    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})


export default skillRoute