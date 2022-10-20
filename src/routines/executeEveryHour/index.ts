// Why did I import this for?
import "reflect-metadata"
import ResourceRepository from "../../repositories/relearn/ResourceRepository"
import { scrapeLolRates } from "../../utils/lolrates/scrapeLolRates"
import { myConsoleError } from "../../utils/myConsoleError"
import { createUserSuggestionsForAll } from "../../utils/user/createUserSuggestionsForAll/createUserSuggestionsForAll"
import saveSkillHistoryFromAllUsers from "./saveSkillHistoryFromAllUsers/saveSkillHistoryFromAllUsers"

const executeEveryHour = async () => {
  scrapeLolRates()
  createUserSuggestionsForAll()
  ResourceRepository.resetRatingsWhereCompletedAtIsNull()
  saveSkillHistoryFromAllUsers()

  setInterval(async () => {
    scrapeLolRates().catch((e) => myConsoleError("Error scraping lolrates"))
    createUserSuggestionsForAll()
    ResourceRepository.resetRatingsWhereCompletedAtIsNull()
  }, 60 * 1000 * 60)
}

export default executeEveryHour
