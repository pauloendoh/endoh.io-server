import { IsNumber, IsString, Min, MinLength } from "class-validator"

export class RecurrentLearningDto {
  id: number

  userId: number

  @IsString()
  @MinLength(1)
  description: string

  @IsNumber()
  @Min(0)
  points: number

  createdAt: string

  updatedAt: string
}
