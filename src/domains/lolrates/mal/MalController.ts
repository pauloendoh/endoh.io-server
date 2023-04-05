import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { MalUser } from "../../../entities/MAL/MalUser"
import { User } from "../../../entities/User"
import { MalService } from "./MalService"

@JsonController()
export class MalController {
  constructor(private service = new MalService()) {}

  @Post("/mal-user")
  async saveMalUser(@CurrentUser() user: User, @Body() malUser: MalUser) {
    return this.service.saveMalUser(user.id, malUser)
  }

  @Get("/mal-user")
  async findMalUser(@CurrentUser() user: User) {
    return this.service.findMalUser(user.id)
  }

  @Get("/mal-similarities")
  async findMalSimilarities(@CurrentUser() user: User) {
    return this.service.findMalSimilarities(user.id)
  }

  @Post("/mal-similarities/:id/check")
  async toggleMalSimilarityCheck(@Param("id") id: number) {
    return this.service.toggleMalSimilarityCheck(id)
  }
}
