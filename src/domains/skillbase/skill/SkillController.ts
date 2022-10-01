import { ForbiddenError } from "apollo-server-core";
import {
  Body,
  Delete,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  Req,
  UseBefore,
} from "routing-controllers";
import { getCustomRepository, getRepository } from "typeorm";
import { IdsDto } from "../../../dtos/IdsDto";
import { Skill } from "../../../entities/skillbase/Skill";
import { SkillExpectation } from "../../../entities/skillbase/SkillExpectation";
import { SkillProgress } from "../../../entities/skillbase/SkillProgress";
import { MyAuthMiddleware } from "../../../middlewares/MyAuthMiddleware";
import SkillRepository from "../../../repositories/skillbase/SkillRepository";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";

@JsonController()
export class SkillController {
  constructor(
    private skillRepo = getCustomRepository(SkillRepository),
    private skillProgressRepo = getRepository(SkillProgress),
    private skillExpectationRepo = getRepository(SkillExpectation)
  ) {}

  // @Get("/skillbase/skill")
  // async findAllSkillsFromAuthUser(
  //   @UseBefore(MyAuthMiddleware)
  //   @Req()
  //   req: MyAuthRequest
  // ) {
  //   const skills = await this.skillRepo.getAllFromUser(req.user.id);
  //   return skills;
  // }

  @Post("/skillbase/skill")
  async createSkill(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Body() sentSkill: Skill
  ) {
    const { user } = req;

    // checking ownership
    if (sentSkill.id) {
      const found = await this.skillRepo.findOne({ id: sentSkill.id, user });
      if (!found) throw new NotFoundError("Not owner or skill not found.");

      // criar progress
      if (
        found.currentLevel > 0 &&
        found.currentLevel < sentSkill.currentLevel
      ) {
        const newProgress = new SkillProgress();
        newProgress.userId = user.id;
        newProgress.skillId = sentSkill.id;
        newProgress.oldLevel = found.currentLevel;
        newProgress.newLevel = sentSkill.currentLevel;
        newProgress.goalLevel = sentSkill.goalLevel;

        await this.skillProgressRepo.save(newProgress);
      }
    }

    sentSkill.userId = req.user.id;

    const savedSkill = await this.skillRepo.save(sentSkill);

    // saving expectations
    const expectations = sentSkill.expectations.map((expectation) => ({
      ...expectation,
      userId: req.user.id,
      skillId: savedSkill.id,
    }));
    await this.skillExpectationRepo.delete({ skillId: savedSkill.id });
    await this.skillExpectationRepo.save(expectations);

    const allSkills = await this.skillRepo.getAllFromUser(user.id);
    return allSkills;
  }

  @Put("/skillbase/skill/:id")
  async updateSkill(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Body() sentSkill: Skill,
    @Param("id") skillId: number
  ) {
    const isOwner = await this.skillRepo.findOne({
      userId: req.user.id,
      id: skillId,
    });
    if (!isOwner)
      throw new ForbiddenError("User is not owner or skill doesn't exist");

    if (isOwner) {
      sentSkill.id = skillId; // PE 1/3 - why do we need this?

      const savedSkill = await this.skillRepo.save(sentSkill);
      return savedSkill;
    }
  }

  @Delete("/skillbase/skill")
  async deleteSkill(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Body() body: IdsDto
  ) {
    await this.skillRepo.deleteIdsFromUser(body.ids, req.user.id);
    const skills = await this.skillRepo.getAllFromUser(req.user.id);

    return skills;
  }
}
