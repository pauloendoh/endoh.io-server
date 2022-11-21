import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import Place from "../../../entities/monerate/Place"
import { User } from "../../../entities/User"
import PlaceRepository from "../../../repositories/monerate/PlaceRepository"

@JsonController("/monerate/place")
export class PlaceController {
  constructor(private placeRepo = PlaceRepository) {}

  @Post("/")
  async savePlace(
    @CurrentUser({ required: true }) user: User,
    @Body() sentPlace: Place
  ) {
    if (sentPlace.id) {
      const results = await this.placeRepo.find({
        where: {
          id: sentPlace.id,
          user,
        },
      })
      if (!results.length) {
        throw new BadRequestError("User is not owner of this place.")
      }
    }

    await this.placeRepo.save({
      id: sentPlace.id,
      user: user,
      name: sentPlace.name,
      bgColor: sentPlace.bgColor,
      icon: sentPlace.icon,
    })

    return this.placeRepo.getPlacesFromUser(user)
  }

  @Get("/")
  async getPlaces(@CurrentUser({ required: true }) user: User) {
    return this.placeRepo.getPlacesFromUser(user)
  }

  @Delete("/:id")
  async deletePlace(
    @CurrentUser({ required: true }) user: User,
    @Param("id") placeId: number
  ) {
    const result = await this.placeRepo.delete({ id: placeId, userId: user.id })
    if (!result.affected) {
      throw new BadRequestError("Place id not found.")
    }

    return this.placeRepo.getPlacesFromUser(user)
  }
}
