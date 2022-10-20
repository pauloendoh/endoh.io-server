import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from "routing-controllers"
import { dataSource } from "../../../dataSource"
import { Label } from "../../../entities/skillbase/Label"
import { User } from "../../../entities/User"
import SkillRepository from "../../../repositories/skillbase/SkillRepository"

@JsonController("/v2/skillbase")
export class LabelController {
  constructor(
    private labelRepo = dataSource.getRepository(Label),
    private skillRepo = SkillRepository
  ) {}

  @Get("/label")
  async labels(@CurrentUser({ required: true }) user: User) {
    return this.labelRepo.find({
      where: { userId: user.id },
    })
  }

  @Post("/label")
  async saveLabel(
    @CurrentUser({ required: true }) user: User,
    @Body({ required: true }) body: Label
  ) {
    body.userId = user.id
    return this.labelRepo.save(body)
  }

  @Delete("/label/:id")
  async deleteLabel(
    @CurrentUser({ required: true }) user: User,
    @Param("id") labelId: number
  ) {
    const label = await this.labelRepo.findOne({
      where: {
        id: labelId,
        userId: user.id,
      },
    })

    if (!label) throw new NotFoundError("Label not found.")

    await this.labelRepo.delete({
      id: label.id,
    })
    return label
  }

  @Get("/skill/:skillId/label")
  async getSkillLabels(
    @CurrentUser({ required: true }) user: User,
    @Param("skillId") skillId: number
  ) {
    const foundSkill = await this.skillRepo.findOne({
      where: { userId: user.id, id: skillId },
      relations: ["labels"],
    })

    return foundSkill
  }

  @Post("/skill/:skillId/label")
  async saveSkillLabel(
    @CurrentUser({ required: true }) user: User,
    @Param("skillId") skillId: number,
    @Body({ required: true }) body: { labelId: number }
  ) {
    const foundSkill = await this.skillRepo.findOne({
      where: { userId: user.id, id: skillId },
      relations: ["labels"],
    })
    const foundLabel = await dataSource.getRepository(Label).findOne({
      where: { id: body.labelId },
    })

    foundSkill.labels.push(foundLabel)
    const savedSkill = await this.skillRepo.save(foundSkill)

    return savedSkill
  }

  @Delete("/skill/:skillId/label")
  async deleteSkillLabel(
    @CurrentUser({ required: true }) user: User,
    @Param("skillId") skillId: number,
    @Body({ required: true }) body: { labelId: number }
  ) {
    const foundSkill = await this.skillRepo.findOne({
      where: { userId: user.id, id: skillId },
      relations: ["labels"],
    })
    const foundLabel = await dataSource.getRepository(Label).findOne({
      where: { id: body.labelId },
    })

    // remove label from skill
    foundSkill.labels = foundSkill.labels.filter(
      (label) => label.id !== foundLabel.id
    )
    const savedSkill = await this.skillRepo.save(foundSkill)

    return savedSkill
  }
}
