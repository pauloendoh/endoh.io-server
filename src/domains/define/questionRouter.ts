import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { userRequiredMiddleware } from "../../middlewares/userRequiredMiddleware"
import { getQuestionRepository } from "../../repositories/define/QuestionRepository"
import { contract } from "../contract"

export const questionRouter: RouterImplementation<
  (typeof contract)["question"]
> = {
  getAllMyQuestions: {
    middleware: [userRequiredMiddleware],
    handler: async ({ req }) => {
      const questionRepo = getQuestionRepository()
      const questions = await questionRepo.getAllQuestionsFromUserId(
        req.user!.id
      )

      return {
        status: 200,
        body: questions,
      }
    },
  },
}
