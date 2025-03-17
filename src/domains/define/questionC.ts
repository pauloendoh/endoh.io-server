// contract.ts

import { initContract } from "@ts-rest/core"
import { z } from "zod"
import { questionSchema } from "../../entities/define/Question"

const c = initContract()

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
})

export const questionC = c.router({
  createPost: {
    method: "POST",
    path: "/posts",
    responses: {
      201: postSchema,
    },
    body: z.object({
      title: z.string(),
      body: z.string(),
    }),
    summary: "Create a post",
  },
  getPost: {
    method: "GET",
    path: `/posts/:id`,
    responses: {
      200: postSchema.nullable(),
    },
    summary: "Get a post by id",
  },
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
