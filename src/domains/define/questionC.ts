// contract.ts

import { initContract } from "@ts-rest/core"
import { z } from "zod"
import { questionSchema } from "../../entities/define/Question"

const c = initContract()

export const questionC = c.router({
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
})
