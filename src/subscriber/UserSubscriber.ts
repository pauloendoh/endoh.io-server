import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm"
import { Profile } from "../entities/feed/Profile"
import { User } from "../entities/User"
import { UserPreference } from "../entities/UserPreference"
import { myConsoleError } from "../utils/myConsoleError"
import createUserSuggestionsForUser from "../utils/user/createUserSuggestionsForAll/createUserSuggestionsForUser/createUserSuggestionsForUser"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return User
  }

  /**
   * Called before post insertion.
   */
  async afterInsert(event: InsertEvent<User>) {
    try {
      // create default preference
      const preference = new UserPreference()
      preference.user = event.entity

      await event.manager.getRepository(UserPreference).save(preference)

      const profile = new Profile()
      profile.user = event.entity
      await event.manager.getRepository(Profile).save(profile)

      // I added this timeout because the event.entity (user).id was not commited yet :/
      setTimeout(async () => {
        await createUserSuggestionsForUser(event.entity)
      }, 1000)
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
