import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

const userGotItSchema = z.object({
  id: z.number(),
  createTag: z.boolean().optional(),
})

export const gotItContract = c.router({
  getUserGotIt: {
    method: "GET",
    path: "/got-it",
    headers: z.object({
      "x-auth-token": z.string(),
    }),
    responses: {
      200: userGotItSchema,
    },
  },
  updateUserGotIt: {
    method: "PUT",
    path: "/got-it",
    headers: z.object({
      "x-auth-token": z.string(),
    }),
    body: z.object({
      id: z.number(),
      createTag: z.boolean(),
    }),
    responses: {
      200: userGotItSchema,
    },
  },
})
