import { ForbiddenError } from "apollo-server-core"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import { Question } from "../../../entities/define/Question"
import { getQuestionRepository } from "../../../repositories/define/QuestionRepository"
import { FlashnotesService } from "./FlashnotesService"
import { CreateManyQuestionsDto } from "./types/CreateManyNotesDto"
import { FlashnotesSearchType } from "./types/FlashnotesSearchType"

@JsonController()
export class FlashnotesController {
  constructor(
    private flashnotesService = new FlashnotesService(),

    private questionRepo = getQuestionRepository()
  ) {}

  @Get("/flashnotes/search")
  async searchFlashnotes(
    @CurrentUser({ required: true })
    user: User,
    @QueryParam("q", { required: true }) q: string,
    @QueryParam("type", { required: true }) type: FlashnotesSearchType
  ) {
    return this.flashnotesService.searchFlashnotes({
      query: q,
      requesterId: user.id,
      type,
    })
  }

  @Get("/define/question")
  async getAllQuestions(
    @CurrentUser({ required: true })
    user: User
  ) {
    return this.questionRepo.getAllQuestionsFromUserId(user.id)
  }

  @Post("/define/question")
  async saveQuestion(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentQuestion: Question
  ) {
    if (sentQuestion.id)
      return this.flashnotesService.updateQuestion(sentQuestion, user.id)

    return this.flashnotesService.createQuestion(sentQuestion, user.id)
  }

  @Put("/define/question/many")
  async updateManyQuestions(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentQuestions: Question[]
  ) {
    const isOwner = await getQuestionRepository().isOwner(
      sentQuestions,
      user.id
    )
    if (!isOwner)
      throw new ForbiddenError("User is not owner of all questions.")

    await this.questionRepo.save(sentQuestions)
    return this.questionRepo.getAllQuestionsFromUserId(user.id)
  }

  @Post("/define/doc/:docId/questions/many")
  async createManyQuestions(
    @CurrentUser({ required: true })
    user: User,
    @Body() body: CreateManyQuestionsDto,
    @Param("docId") docId: number
  ) {
    return this.flashnotesService.createManyQuestions(
      docId,
      body.questionsQuantity,
      user.id
    )
  }

  @Delete("/question/:questionId")
  async deleteQuestion(
    @CurrentUser({ required: true })
    user: User,
    @Param("questionId") questionId: number
  ) {
    return this.flashnotesService.deleteQuestion(questionId, user.id)
  }
}
