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
import { Doc } from "../../entities/define/Doc"
import { User } from "../../entities/User"
import { MyAuthMiddleware } from "../../middlewares/MyAuthMiddleware"
import { getDocRepository } from "../../repositories/define/DocRepository"
import { getNoteRepository } from "../../repositories/define/NoteRepository"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { DocService } from "./DocService"

@JsonController()
export class DocController {
  constructor(
    private docService = new DocService(),
    private docRepository = getDocRepository(),
    private noteRepo = getNoteRepository()
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

    const newDoc = new Doc()
    newDoc.title = sentDoc.title
    newDoc.userId = user.id
    newDoc.folderId = sentDoc.folderId

    const savedDoc = await this.docRepository.save(newDoc)
    return savedDoc
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

  @Delete("/define/doc/:id/clear-empty-notes")
  async clearEmptyNotes(
    @CurrentUser({ required: true }) user: User,
    @Param("id") docId: number
  ) {
    await this.noteRepo.removeEmptyNotesFromDocId(docId, user.id)

    return this.noteRepo.getAllNotesFromUserId(user.id)
  }
}
