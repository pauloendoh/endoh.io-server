export interface PasswordResetPostDto {
    userId: number, 
    token: string, 
    password: string , 
    password2: string
}