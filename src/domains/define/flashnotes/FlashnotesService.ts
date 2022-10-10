import { getCustomRepository } from "typeorm"
import NoteRepository from "../../../repositories/define/NoteRepository"

export class FlashnotesService {
  constructor(private noteRepository = getCustomRepository(NoteRepository)) {}

  async searchFlashnotes(query: string, requesterId: number) {
    return { notes: await this.noteRepository.searchNotes(query, requesterId) }
  }
}
