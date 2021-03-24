export interface NotificationDto {
    id: number,
    seen: boolean,
    message: string,
    createdAt: string,
    userId: number,
    username: string,
    fullName: string,
    pictureUrl: string
}