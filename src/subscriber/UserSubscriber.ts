import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm"
import { EmailService } from "../domains/email/EmailService"
import { Profile } from "../entities/feed/Profile"
import { User } from "../entities/User"
import { UserPreference } from "../entities/UserPreference"
import { myConsoleError } from "../utils/myConsoleError"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private emailService = new EmailService()) {}
  listenTo() {
    return User
  }

  async afterInsert(event: InsertEvent<User>) {
    try {
      const preference = new UserPreference()
      preference.user = event.entity

      this.emailService.notifyNewUserToDevs(event.entity)

      // YOU HAVE TO USE event.manger.getRepository in order to make timely changes
      await event.manager.getRepository(UserPreference).save(preference)

      const profile = new Profile()
      profile.userId = event.entity.id
      await event.manager.getRepository(Profile).save(profile)

      // Create user suggestions
      // await UserSuggestionRepository.createUserSuggestionsForUser(event.entity)

      // Create user tags
      // const tags = await TagRepository.createExampleTagsForNewUser(event.entity)

      // Create resources
      // await ResourceRepository.createResourcesForNewUser(event.entity, tags)

      // Create skill to Programming tag
      // const skills = await SkillRepository.createSkillsForNewUser(
      //   event.entity,
      //   tags[0]
      // )

      // Create skill expectations
      // await SkillExpectationRepository.createExpectationsForNewUser(
      //   event.entity,
      //   skills
      // )

      // Create little prince doc
      // const doc = await DocRepository.createDocForNewUser(event.entity)

      // Create little prince notes
      // await NoteRepository.createNotesForNewUser(event.entity, doc)
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
