// contract.ts

import { initContract } from "@ts-rest/core"
import { z } from "zod"
import { questionSchema } from "../../entities/define/Question"

const c = initContract()

export const questionContract = c.router({
  getAllMyQuestions: {
    method: "GET",
    path: "/define/question",
    headers: z.object({
      "x-auth-token": z.string(),
    }),
    responses: {
      200: z.array(questionSchema),
    },
  },
  askGpt: {
    method: "GET",
    path: "/ask-gpt",
    headers: z.object({
      "x-auth-token": z.string(),
    }),
    query: z.object({
      question: z.string(),
    }),
    responses: {
      200: z.object({
        answer: z.string(),
      }),
      403: z.object({
        message: z.literal("You're not allowed to access this resource."),
      }),
    },
  },
})
