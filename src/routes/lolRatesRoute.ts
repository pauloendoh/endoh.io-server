import { Router } from "express"
import { getConnection, getCustomRepository } from "typeorm"
import LolRateRepository from "../repositories/lolrates/LolRateRepository"
import { MyErrorsResponse } from "../utils/ErrorMessage"
import { myConsoleError } from "../utils/myConsoleError"

const lolRatesRoute = Router()
const lolRateRepo = getCustomRepository(LolRateRepository)

//  PE 2/3
lolRatesRoute.get("/", async (req, res) => {
  try {
    const connection = getConnection()
    const rates = await lolRateRepo.getRates()
    const updatedAt = await lolRateRepo.getUpdatedAt()
    return res.json({ rates, updatedAt: updatedAt[0] })
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

export default lolRatesRoute
