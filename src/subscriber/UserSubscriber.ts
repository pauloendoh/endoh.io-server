import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { User } from '../entities/User';
import { UserPreference } from '../entities/UserPreference';

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
        const preference = new UserPreference()
        preference.user = event.entity

        await event.manager.getRepository(UserPreference).save(preference)
    }

}