import { NotFoundError } from "routing-controllers"
import { Note } from "../../../entities/define/Note"
import DocRepository from "../../../repositories/define/DocRepository"
import NoteRepository from "../../../repositories/define/NoteRepository"

export class FlashnotesService {
  constructor(
    private noteRepository = NoteRepository,
    private docRepo = DocRepository
  ) {}

  async createQuestion(sentNote: Note, requesterId: number) {
    sentNote.userId = requesterId
    sentNote.doc = undefined

    const noteWithHighestIndex = await this.noteRepository.findNoteWithHighestIndex(
      sentNote.docId
    )

    sentNote.index = noteWithHighestIndex.index + 1

    return this.noteRepository.save(sentNote)
  }

  async searchFlashnotes(query: string, requesterId: number) {
    const [docs, notes] = await Promise.all([
      this.docRepo.searchDocs(query, requesterId),
      this.noteRepository.searchNotes(query, requesterId),
    ])

    return {
      docs,
      notes,
    }
  }

  async createManyNotes(docId: number, quantity: number, requesterId: number) {
    const doc = await this.docRepo.findOne({
      where: {
        id: docId,
        userId: requesterId,
      },
    })

    if (!doc) throw new NotFoundError("Doc not found or user is not owner")

    const highestIndexNote = await this.noteRepository.findNoteWithHighestIndex(
      docId
    )

    return this.noteRepository.createEmptyNotes({
      docId,
      userId: requesterId,
      initialIndex: highestIndexNote ? highestIndexNote.index + 1 : 0,
      quantity: quantity,
    })
  }
}
