import { NotFoundError } from "routing-controllers"
import { Note } from "../../../entities/define/Note"
import DocRepository from "../../../repositories/define/DocRepository"
import NoteRepository from "../../../repositories/define/NoteRepository"
import { FlashnotesSearchType } from "./types/FlashnotesSearchType"

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

    sentNote.index = noteWithHighestIndex ? noteWithHighestIndex.index + 1 : 0

    return this.noteRepository.save(sentNote)
  }

  async updateQuestion(sentNote: Note, requesterId: number) {
    const found = await this.noteRepository.findOne({
      where: { userId: requesterId, id: sentNote.id },
    })

    if (!found)
      throw new NotFoundError("Note doesn't exist or user is not owner")

    sentNote.userId = requesterId
    sentNote.doc = undefined

    return this.noteRepository.save(sentNote)
  }

  async searchFlashnotes(options: {
    query: string
    requesterId: number
    type: FlashnotesSearchType
  }) {
    const { query, requesterId, type } = options

    if (type === "questions") {
      return {
        docs: [],
        notes: await this.noteRepository.searchNotesByQuestionText(
          query,
          requesterId
        ),
      }
    }

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

  deleteQuestion = async (questionId: number, requesterId: number) => {
    const found = await this.noteRepository.findOne({
      where: { userId: requesterId, id: questionId },
    })

    if (!found)
      throw new NotFoundError("Note doesn't exist or user is not owner")

    return this.noteRepository.delete(questionId)
  }
}
