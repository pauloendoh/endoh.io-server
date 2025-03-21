import OpenAI from "openai"

import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { userRequiredMiddleware } from "../../middlewares/userRequiredMiddleware"
import { getQuestionRepository } from "../../repositories/define/QuestionRepository"
import { myEnvs } from "../../utils/myEnvs"
import { questionContract } from "./questionContract"

export const questionRouter: RouterImplementation<typeof questionContract> = {
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
  askGpt: {
    middleware: [userRequiredMiddleware],
    handler: async ({ req }) => {
      const user = req.user

      if (user?.username !== "pauloendoh") {
        return {
          status: 403,
          body: {
            message: "You're not allowed to access this resource.",
          },
        }
      }
      const openAi = new OpenAI({
        apiKey: myEnvs.OPEN_AI_KEY,
      })

      const question = req.query.question
      const completion = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Be concise. No answers longer than 6 sentences.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      })

      const choices = completion.choices
      console.log({
        choices,
      })
      const answer = completion.choices[0].message.content ?? "No answer"

      return {
        status: 200,
        body: {
          answer,
        },
      }
    },
  },
}
