import { ForbiddenError } from "apollo-server-core"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  Post,
  QueryParam,
} from "routing-controllers"
import { Note } from "../../../entities/define/Note"
import { User } from "../../../entities/User"
import { getNoteRepository } from "../../../repositories/define/NoteRepository"
import { FlashnotesService } from "./FlashnotesService"

@JsonController()
export class FlashnotesController {
  constructor(
    private flashnotesService = new FlashnotesService(),

    private noteRepo = getNoteRepository()
  ) {}

  @Get("/flashnotes/search")
  async searchFlashnotes(
    @CurrentUser({ required: true })
    user: User,
    @QueryParam("q", { required: true }) q: string
  ) {
    return this.flashnotesService.searchFlashnotes(q, user.id)
  }

  @Get("/define/note")
  async getAllNotes(
    @CurrentUser({ required: true })
    user: User
  ) {
    return this.noteRepo.getAllNotesFromUserId(user.id)
  }

  @Post("/define/note")
  async saveNote(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentNote: Note
  ) {
    if (sentNote.id) {
      //ownership
      const found = await getNoteRepository().findOne({
        where: { userId: user.id, id: sentNote.id },
      })

      if (!found)
        throw new NotFoundError("Note doesn't exist or user is not owner")
    }

    sentNote.userId = user.id

    return this.noteRepo.save(sentNote)
  }

  @Post("/define/note/many")
  async saveMany(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentNotes: Note[]
  ) {
    const isOwner = await getNoteRepository().isOwner(sentNotes, user.id)
    if (!isOwner) throw new ForbiddenError("User is not owner of all notes.")

    await this.noteRepo.save(sentNotes)
    return this.noteRepo.getAllNotesFromUserId(user.id)
  }
}
