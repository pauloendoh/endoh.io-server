import { User } from '../User';
import { Tag } from './Tag';
export declare class Resource {
    id: number;
    user: User;
    userId: number;
    title: string;
    url: string;
    thumbnail: string;
    estimatedTime: string;
    dueDate: string;
    rating: number;
    completedAt: string;
    position: number;
    publicReview: string;
    privateNote: string;
    createdAt: string;
    updatedAt: string;
    tag: Tag;
    tagId: number;
}
