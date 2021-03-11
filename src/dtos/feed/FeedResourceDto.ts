
export interface FeedResourceDto {
    user: {
        id: number,
        username: string,
    },
    tag: {
        id: number,
        name: string,
        color: string
    }
    id: number,
    title: string
    url: string,
    thumbnail: string,
    estimatedTime: string,
    dueDate: string
    rating: number,
    completedAt: string
}

