import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Post,
  UseBefore,
} from "routing-controllers"
import { dataSource } from "../../../dataSource"
import { IdsDto } from "../../../dtos/IdsDto"
import { Skill } from "../../../entities/skillbase/Skill"
import { SkillExpectation } from "../../../entities/skillbase/SkillExpectation"
import { SkillProgress } from "../../../entities/skillbase/SkillProgress"
import { User } from "../../../entities/User"
import { MyAuthMiddleware } from "../../../middlewares/MyAuthMiddleware"
import SkillRepository from "../../../repositories/skillbase/SkillRepository"

@JsonController()
export class SkillController {
  constructor(
    private readonly skillRepo = SkillRepository,
    private readonly skillProgressRepo = dataSource.getRepository(
      SkillProgress
    ),
    private readonly skillExpectationRepo = dataSource.getRepository(
      SkillExpectation
    )
  ) {}

  @Get("/skillbase/skill")
  async findAllSkillsFromAuthUser(
    @UseBefore(MyAuthMiddleware)
    @CurrentUser({ required: true })
    user: User
  ) {
    const skills = await this.skillRepo.getAllFromUser(user.id)
    return skills
  }

  @Post("/skillbase/skill")
  async createSkill(
    @UseBefore(MyAuthMiddleware)
    @CurrentUser({ required: true })
    user: User,

    @Body() sentSkill: Skill
  ) {
    // checking ownership
    if (sentSkill.id) {
      const found = await this.skillRepo.findOne({
        where: {
          id: sentSkill.id,
          userId: user.id,
        },
      })
      if (!found) throw new NotFoundError("Not owner or skill not found.")

      // criar progress
      if (
        found.currentLevel > 0 &&
        found.currentLevel < sentSkill.currentLevel
      ) {
        const newProgress = new SkillProgress()
        newProgress.userId = user.id
        newProgress.skillId = sentSkill.id
        newProgress.oldLevel = found.currentLevel
        newProgress.newLevel = sentSkill.currentLevel
        newProgress.goalLevel = sentSkill.goalLevel

        await this.skillProgressRepo.save(newProgress)
      }
    }

    sentSkill.userId = user.id

    const savedSkill = await this.skillRepo.save(sentSkill)

    // saving expectations
    const expectations = sentSkill.expectations.map((expectation) => ({
      ...expectation,
      userId: user.id,
      skillId: savedSkill.id,
    }))
    await this.skillExpectationRepo.delete({ skillId: savedSkill.id })
    await this.skillExpectationRepo.save(expectations)

    return savedSkill
  }

  @Delete("/skillbase/skill")
  async deleteSkill(
    @UseBefore(MyAuthMiddleware)
    @CurrentUser({ required: true })
    user: User,
    @Body() body: IdsDto
  ) {
    await this.skillRepo.deleteIdsFromUser(body.ids, user.id)
    const skills = await this.skillRepo.getAllFromUser(user.id)

    return skills
  }
}
