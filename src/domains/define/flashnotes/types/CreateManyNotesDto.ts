import { IsNumber, Max } from "class-validator"

export class CreateManyNotesDto {
  @IsNumber()
  @Max(25)
  notesQuantity: number
}
