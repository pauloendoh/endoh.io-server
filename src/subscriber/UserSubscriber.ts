import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Profile } from '../entities/feed/Profile';
import { User } from '../entities/User';
import { UserPreference } from '../entities/UserPreference';
import { myConsoleError } from '../utils/myConsoleError';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {


    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return User;
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


            // TODO: create default profile
            const profile = new Profile()
            profile.user = event.entity

            await event.manager.getRepository(Profile).save(profile)
        } catch (e) {
            myConsoleError(e.message)
        }


    }

}