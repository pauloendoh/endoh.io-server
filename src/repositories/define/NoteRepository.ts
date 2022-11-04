import { dataSource } from "../../dataSource"
import { Doc } from "../../entities/define/Doc"
import { Note } from "../../entities/define/Note"
import { User } from "../../entities/User"

export const getNoteRepository = () => NoteRepository

const NoteRepository = dataSource.getRepository(Note).extend({
  async getAllNotesFromUserId(userId: number): Promise<Note[]> {
    return this.createQueryBuilder("note")
      .where({ userId })
      .orderBy("note.docId", "ASC")
      .addOrderBy("note.index", "ASC")
      .getMany()
  },
  async isOwner(notes: Note[], userId: number): Promise<boolean> {
    const ids = notes.map((note) => note.id)

    if (ids.length === 0) return true

    const count = await this.createQueryBuilder("note")
      .where("note.id IN (:...ids)", { ids })
      .andWhere("note.userId = :userId", { userId })
      .getCount()

    return ids.length === count
  },

  async createNotesForNewUser(user: User, doc: Doc): Promise<Note[]> {
    const notes: Note[] = []

    notes.push(
      await this.save({
        user,
        doc,
        index: 0,
        description: `[Tip] You can create study notes here! Also, you can create flashcard questions to test yourself, but they are not obligatory like in other tools! \nTest Yourself!`,
      })
    )

    notes.push(
      await this.save({
        user,
        doc,
        index: 1,
        description: `All grown-ups were once children... but only few of them remember it.`,
        question: "What do the grown-ups forget?",
      })
    )

    notes.push(
      await this.save({
        user,
        doc,
        index: 2,
        description: `"I am looking for friends. What does that mean -- tame?"
      \n\n"It is an act too often neglected," said the fox. \n\n"It means to establish ties."
      
      \n\n"To establish ties?"
      
      \n\n"Just that," said the fox.
      \n\n"To me, you are still nothing more than a little boy who is just like a hundred thousand other little boys. And I have no need of you. And you, on your part, have no need of me. To you I am nothing more than a fox like a hundred thousand other foxes. But if you tame me, then we shall need each other. To me, you will be unique in all the world. To you, I shall be unique in all the world...."`,
        question: 'What means to "tame" ?',
      })
    )

    notes.push(
      await this.save({
        user,
        doc,
        index: 3,
        description:
          "“Well, I must endure the presence of a few caterpillars if I wish to become acquainted with the butterflies.”",
        question: "What must you endure to get butterflies?",
      })
    )

    return notes
  },

  async removeEmptyNotesFromDocId(docId: number, userId: number) {
    await this.createQueryBuilder()
      .delete()
      .where("docId = :docId", { docId })
      .andWhere("userId = :userId", { userId })
      .andWhere("trim(description) = ''")
      .andWhere("trim(question) = ''")
      .execute()

    // normalize indexes
    const notes = await this.find({ where: { docId, userId } })
    const newNotes = notes.map((note, index) => ({ ...note, index }))
    await this.save(newNotes)
  },

  async searchNotes(text: string, userId: number) {
    console.log("searching notes")
    const words = text.split(" ")

    let query = NoteRepository.createQueryBuilder("note").where({ userId })

    // multi word search
    words.forEach((word, index) => {
      // https://github.com/typeorm/typeorm/issues/3119
      query = query.andWhere(
        `(unaccent(note.description) ilike unaccent(:text${index}) 
                 or unaccent(note.question) ilike unaccent(:text${index}))`,
        {
          [`text${index}`]: `%${word}%`,
        }
      )
    })

    query = query
      .leftJoinAndSelect("note.doc", "doc")
      .orderBy('note."updatedAt"', "DESC")

    return query.getMany()
  },

  async findNoteWithHighestIndex(docId: number) {
    return NoteRepository.findOne({
      where: {
        docId,
      },
      order: {
        index: "DESC",
      },
    })
  },

  async createEmptyNotes(args: {
    quantity: number
    docId: number
    userId: number
    initialIndex: number
  }) {
    const { quantity, docId, userId, initialIndex } = args

    let notes: Note[] = []

    await this.manager.transaction(async (manager) => {
      for (let i = initialIndex; i < initialIndex + quantity; i++) {
        const newNote = new Note()
        newNote.userId = userId
        newNote.docId = docId
        newNote.index = i
        newNote.description = ""
        const savedNote = await manager.save(newNote)
        notes.push(savedNote)
      }
    })

    return notes
  },
})

export default NoteRepository
