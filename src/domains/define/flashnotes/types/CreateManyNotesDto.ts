import { IsNumber, Max } from "class-validator"

export class CreateManyQuestionsDto {
  @IsNumber()
  @Max(25)
  questionsQuantity: number
}
