import { EntityRepository, Repository } from "typeorm"
import { Doc } from "../../entities/define/Doc"
import { Note } from "../../entities/define/Note"

@EntityRepository(Note)
export default class NoteRepository extends Repository<Note> {
  async getAllNotesFromUserId(userId: number): Promise<Note[]> {
    return this.createQueryBuilder("note")
      .where({ userId })
      .orderBy("note.docId", "ASC")
      .addOrderBy("note.index", "ASC")
      .getMany()
  }

  async isOwner(notes: Note[], userId: number): Promise<boolean> {
    const ids = notes.map((note) => note.id)

    const count = await this.createQueryBuilder("note")
      .where("note.id IN (:...ids)", { ids })
      .andWhere("note.userId = :userId", { userId })
      .getCount()

    return ids.length === count
  }
}
