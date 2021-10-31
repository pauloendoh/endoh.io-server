import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Profile } from "../entities/feed/Profile";
import { User } from "../entities/User";
import { UserPreference } from "../entities/UserPreference";
import DocRepository from "../repositories/define/DocRepository";
import NoteRepository from "../repositories/define/NoteRepository";
import UserSuggestionRepository from "../repositories/feed/UserSuggestionRepository";
import ResourceRepository from "../repositories/relearn/ResourceRepository";
import TagRepository from "../repositories/relearn/TagRepository";
import SkillExpectationRepository from "../repositories/skillbase/SkillExpectationRepository";
import SkillRepository from "../repositories/skillbase/SkillRepository";
import { myConsoleError } from "../utils/myConsoleError";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    try {
      const preference = new UserPreference();
      preference.user = event.entity;

      // YOU HAVE TO USE event.manger.getRepository in order to make timely changes
      await event.manager.getRepository(UserPreference).save(preference);

      const profile = new Profile();
      profile.user = event.entity;
      await event.manager.getRepository(Profile).save(profile);

      // Create user suggestions
      await event.manager
        .getCustomRepository(UserSuggestionRepository)
        .createUserSuggestionsForUser(event.entity);

      // Create user tags
      const tags = await event.manager
        .getCustomRepository(TagRepository)
        .createExampleTagsForNewUser(event.entity);

      // Create resources
      await event.manager
        .getCustomRepository(ResourceRepository)
        .createResourcesForNewUser(event.entity, tags);

      // Create skill to Programming tag
      const skills = await event.manager
        .getCustomRepository(SkillRepository)
        .createSkillsForNewUser(event.entity, tags[0]);

      // Create skill expectations
      await event.manager
        .getCustomRepository(SkillExpectationRepository)
        .createExpectationsForNewUser(event.entity, skills);

      // Create little prince doc
      const doc = await event.manager
        .getCustomRepository(DocRepository)
        .createDocForNewUser(event.entity);

      // Create little prince notes
      await event.manager
        .getCustomRepository(NoteRepository)
        .createNotesForNewUser(event.entity, doc);
    } catch (e) {
      myConsoleError(e.message);
    }
  }
}
