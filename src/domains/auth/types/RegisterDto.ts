import { IsEmail, IsString } from "class-validator"

export class RegisterDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  password2: string
}
