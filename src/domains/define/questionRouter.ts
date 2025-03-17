import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { authMiddleware } from "../../middlewares/authMiddleware"
import { getQuestionRepository } from "../../repositories/define/QuestionRepository"
import { contract } from "../contract"

const posts: { id: string; title: string; body: string }[] = []

export const questionRouter: RouterImplementation<
  (typeof contract)["question"]
> = {
  getPost: async ({ params: { id } }) => {
    const post = posts.find((post) => post.id === id)

    return {
      status: 200,
      body: post ?? null,
    }
  },
  createPost: async ({ body }) => {
    const post = { ...body, id: Math.random().toString() }

    posts.push(post)

    return {
      status: 201,
      body: post,
    }
  },
  getAllMyQuestions: {
    middleware: [authMiddleware],
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
