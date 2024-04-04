import { dataSource } from "../../dataSource"
import { Doc } from "../../entities/define/Doc"
import { Question } from "../../entities/define/Question"
import { User } from "../../entities/User"

export const getQuestionRepository = () => QuestionRepository

const QuestionRepository = dataSource.getRepository(Question).extend({
  async getAllQuestionsFromUserId(userId: number): Promise<Question[]> {
    return this.createQueryBuilder("question")
      .where({ userId })
      .orderBy("question.docId", "ASC")
      .addOrderBy("question.index", "ASC")
      .getMany()
  },
  async isOwner(questions: Question[], userId: number): Promise<boolean> {
    const ids = questions.map((question) => question.id)

    if (ids.length === 0) return true

    const count = await this.createQueryBuilder("question")
      .where("question.id IN (:...ids)", { ids })
      .andWhere("question.userId = :userId", { userId })
      .getCount()

    return ids.length === count
  },

  async createQuestionsForNewUser(user: User, doc: Doc): Promise<Question[]> {
    const questions: Question[] = []

    questions.push(
      await this.save({
        user,
        doc,
        index: 0,
        description: `[Tip] You can create study questions here! Also, you can create flashcard questions to test yourself, but they are not obligatory like in other tools! \nTest Yourself!`,
      })
    )

    questions.push(
      await this.save({
        user,
        doc,
        index: 1,
        description: `All grown-ups were once children... but only few of them remember it.`,
        question: "What do the grown-ups forget?",
      })
    )

    questions.push(
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

    questions.push(
      await this.save({
        user,
        doc,
        index: 3,
        description:
          "“Well, I must endure the presence of a few caterpillars if I wish to become acquainted with the butterflies.”",
        question: "What must you endure to get butterflies?",
      })
    )

    return questions
  },

  async removeEmptyQuestionsFromDocId(docId: number, userId: number) {
    await this.createQueryBuilder()
      .delete()
      .where("docId = :docId", { docId })
      .andWhere("userId = :userId", { userId })
      .andWhere("trim(description) = ''")
      .andWhere("trim(question) = ''")
      .execute()

    // normalize indexes
    const questions = await this.find({ where: { docId, userId } })
    const newQuestions = questions.map((question, index) => ({
      ...question,
      index,
    }))
    await this.save(newQuestions)
  },

  async searchQuestionsByQuestionText(text: string, userId: number) {
    const words = text.split(" ")

    let query = QuestionRepository.createQueryBuilder("question").where({
      userId,
    })

    words.forEach((word, index) => {
      query = query.andWhere(
        `(unaccent(question.question) ilike unaccent(:text${index}))`,
        {
          [`text${index}`]: `%${word}%`,
        }
      )
    })

    query = query
      .leftJoinAndSelect("question.doc", "doc")
      .orderBy('question."updatedAt"', "DESC")

    return query.getMany()
  },

  async searchQuestions(text: string, userId: number) {
    const words = text.split(" ")

    let query = QuestionRepository.createQueryBuilder("question")
      .leftJoinAndSelect("question.doc", "doc")
      .where({ userId })

    // multi word search
    words.forEach((word, index) => {
      // https://github.com/typeorm/typeorm/issues/3119
      query = query.andWhere(
        `(unaccent(question.description) ilike unaccent(:text${index}) 
                 or unaccent(question.question) ilike unaccent(:text${index})
                 or unaccent(doc.title) ilike unaccent(:text${index})
                 )`,
        {
          [`text${index}`]: `%${word}%`,
        }
      )
    })

    query = query.orderBy('question."updatedAt"', "DESC")

    return query.getMany()
  },

  async findQuestionWithHighestIndex(docId: number) {
    return QuestionRepository.findOne({
      where: {
        docId,
      },
      order: {
        index: "DESC",
      },
    })
  },

  async createEmptyQuestions(args: {
    quantity: number
    docId: number
    userId: number
    initialIndex: number
  }) {
    const { quantity, docId, userId, initialIndex } = args

    let questions: Question[] = []

    await this.manager.transaction(async (manager) => {
      for (let i = initialIndex; i < initialIndex + quantity; i++) {
        const newQuestion = new Question()
        newQuestion.userId = userId
        newQuestion.docId = docId
        newQuestion.index = i
        newQuestion.description = ""
        const savedQuestion = await manager.save(newQuestion)
        questions.push(savedQuestion)
      }
    })

    return questions
  },
})

export default QuestionRepository
