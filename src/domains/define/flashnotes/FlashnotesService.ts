import { NotFoundError } from "routing-controllers"
import DocRepository from "../../../repositories/define/DocRepository"
import NoteRepository from "../../../repositories/define/NoteRepository"

export class FlashnotesService {
  constructor(
    private noteRepository = NoteRepository,
    private docRepo = DocRepository
  ) {}

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
      initialIndex: highestIndexNote.index + 1,
      quantity: quantity,
    })
  }
}
