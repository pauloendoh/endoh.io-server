import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/User';
export declare class UserSubscriber implements EntitySubscriberInterface<User> {
    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo(): typeof User;
    /**
     * Called before post insertion.
     */
    afterInsert(event: InsertEvent<User>): Promise<void>;
}
