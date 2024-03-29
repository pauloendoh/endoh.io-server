import "reflect-metadata"

import { dataSource } from "../../../dataSource"
import { User } from "../../../entities/User"
import { getUserSuggestionRepo } from "../../../repositories/feed/UserSuggestionRepository"
import { myConsoleError } from "../../myConsoleError"

export const createUserSuggestionsForAll = async () => {
  try {
    const allUsers = await dataSource.getRepository(User).find()
    const suggestionRepo = getUserSuggestionRepo()
    for (const user of allUsers) {
      await suggestionRepo.createUserSuggestionsForUser(user)
    }
  } catch (e) {
    myConsoleError("error createUserSuggestionsForAll(): " + e.message)
  }
}
