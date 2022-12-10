import {
  Body,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
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
    private skillRepo = SkillRepository,
    private skillProgressRepo = dataSource.getRepository(SkillProgress),
    private skillExpectationRepo = dataSource.getRepository(SkillExpectation)
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

  @Put("/skillbase/skill/:id")
  async updateSkill(
    @UseBefore(MyAuthMiddleware)
    @CurrentUser({ required: true })
    user: User,
    @Body() sentSkill: Skill,
    @Param("id") skillId: number
  ) {
    const isOwner = await this.skillRepo.findOne({
      where: {
        userId: user.id,
        id: skillId,
      },
    })
    if (!isOwner)
      throw new ForbiddenError("User is not owner or skill doesn't exist")

    if (isOwner) {
      sentSkill.id = skillId // PE 1/3 - why do we need this?

      const savedSkill = await this.skillRepo.save(sentSkill)
      return savedSkill
    }
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
