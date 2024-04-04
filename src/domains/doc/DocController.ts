import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  Req,
  UseBefore,
} from "routing-controllers"
import { User } from "../../entities/User"
import { Doc } from "../../entities/define/Doc"
import { MyAuthMiddleware } from "../../middlewares/MyAuthMiddleware"
import { getDocRepository } from "../../repositories/define/DocRepository"
import { getQuestionRepository } from "../../repositories/define/QuestionRepository"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { DocService } from "./DocService"

@JsonController()
export class DocController {
  constructor(
    private docService = new DocService(),
    private docRepository = getDocRepository(),
    private questionRepo = getQuestionRepository()
  ) {}

  @Delete("/docs/:docId")
  deleteDoc(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Param("docId") docId: number
  ) {
    return this.docService.deleteDoc(docId, req.user.id)
  }

  @Get("/define/doc")
  async getDocs(@CurrentUser({ required: true }) user: User) {
    return this.docRepository.getAllDocsFromUserId(user.id)
  }

  @Post("/define/doc")
  async saveDoc(
    @CurrentUser({ required: true }) user: User,
    @Body() sentDoc: Doc
  ) {
    if (sentDoc.id) {
      const doc = await getDocRepository().findOne({
        where: { id: sentDoc.id, userId: user.id },
      })

      if (!doc)
        throw new NotFoundError("Doc not found or user does not own it.")

      doc.title = sentDoc.title
      doc.folderId = sentDoc.folderId
      const savedDoc = await this.docRepository.save(doc)
      return savedDoc
    }

    return this.docService.createDoc(sentDoc, user.id)
  }

  @Put("/define/doc/:id/last-opened-at")
  async changeLastOpenedDoc(
    @CurrentUser({ required: true }) user: User,
    @Param("id") docId: number
  ) {
    const found = await this.docRepository.findOne({
      where: {
        userId: user.id,
        id: docId,
      },
    })

    if (!found) throw new NotFoundError("Not found.")

    found.lastOpenedAt = new Date().toISOString()
    const saved = await getDocRepository().save(found)
    return saved
  }

  @Delete("/define/doc/:id/clear-empty-questions")
  async clearEmptyQuestions(
    @CurrentUser({ required: true }) user: User,
    @Param("id") docId: number
  ) {
    await this.questionRepo.removeEmptyQuestionsFromDocId(docId, user.id)

    return this.questionRepo.getAllQuestionsFromUserId(user.id)
  }
}
