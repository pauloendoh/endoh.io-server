import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

const userGotItSchema = z.object({
  id: z.number(),
  createTag: z.boolean().optional(),
})

export const weatherContract = c.router({
  getWeatherForecast: {
    method: "GET",
    path: "/weather-forecast",
    query: z.object({
      // numeric string
      lat: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: "Latitude must be a number",
        })
        .transform((val) => Number(val)),
      lon: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: "Longitude must be a number",
        })
        .transform((val) => Number(val)),
    }),
    responses: {
      200: z.array(
        z.object({
          time: z.string().optional(),
          temperature: z.number().optional(),
          description: z.string().optional(),
        })
      ),
    },
  },
})
