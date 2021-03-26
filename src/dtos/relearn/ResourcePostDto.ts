import { Tag } from '../../entities/relearn/Tag';

export interface ResourcePostDto {
    id: number
    userId: number
    title: string;
    url: string;
    thumbnail: string;
    estimatedTime: string;
    dueDate: string;
    rating: number
    completedAt: string,
    position: number,
    publicReview: string,
    privateNote: string,

    fromResourceId: number,

    createdAt: string
    updatedAt: string
    tag: Tag // Maybe we should use TagDto instead 
}
