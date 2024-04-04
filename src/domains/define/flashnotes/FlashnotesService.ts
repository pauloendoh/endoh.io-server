import { NotFoundError } from "routing-controllers"
import { Question } from "../../../entities/define/Question"
import DocRepository from "../../../repositories/define/DocRepository"
import QuestionRepository from "../../../repositories/define/QuestionRepository"
import { FlashnotesSearchType } from "./types/FlashnotesSearchType"

export class FlashnotesService {
  constructor(
    private questionRepo = QuestionRepository,
    private docRepo = DocRepository
  ) {}

  async createQuestion(sentQuestion: Question, requesterId: number) {
    sentQuestion.userId = requesterId

    const questionWithHighestIndex =
      await this.questionRepo.findQuestionWithHighestIndex(sentQuestion.docId)

    sentQuestion.index = questionWithHighestIndex
      ? questionWithHighestIndex.index + 1
      : 0

    return this.questionRepo.save({
      ...sentQuestion,
      doc: undefined,
    })
  }

  async updateQuestion(sentQuestion: Question, requesterId: number) {
    const found = await this.questionRepo.findOne({
      where: { userId: requesterId, id: sentQuestion.id },
    })

    if (!found)
      throw new NotFoundError("Question doesn't exist or user is not owner")

    return this.questionRepo.save({
      ...sentQuestion,
      userId: requesterId,
      doc: undefined,
    })
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
        questions: await this.questionRepo.searchQuestionsByQuestionText(
          query,
          requesterId
        ),
      }
    }

    const [docs, questions] = await Promise.all([
      this.docRepo.searchDocs(query, requesterId),
      this.questionRepo.searchQuestions(query, requesterId),
    ])

    return {
      docs,
      questions,
    }
  }

  async createManyQuestions(
    docId: number,
    quantity: number,
    requesterId: number
  ) {
    const doc = await this.docRepo.findOne({
      where: {
        id: docId,
        userId: requesterId,
      },
    })

    if (!doc) throw new NotFoundError("Doc not found or user is not owner")

    const highestIndexQuestion =
      await this.questionRepo.findQuestionWithHighestIndex(docId)

    return this.questionRepo.createEmptyQuestions({
      docId,
      userId: requesterId,
      initialIndex: highestIndexQuestion ? highestIndexQuestion.index + 1 : 0,
      quantity: quantity,
    })
  }

  deleteQuestion = async (questionId: number, requesterId: number) => {
    const found = await this.questionRepo.findOne({
      where: { userId: requesterId, id: questionId },
    })

    if (!found)
      throw new NotFoundError("Question doesn't exist or user is not owner")

    return this.questionRepo.delete(questionId)
  }
}
