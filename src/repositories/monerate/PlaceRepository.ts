import { dataSource } from "../../dataSource"
import Place from "../../entities/monerate/Place"
import { User } from "../../entities/User"

const PlaceRepository = dataSource.getRepository(Place).extend({
  async getPlacesFromUser(user: User): Promise<Place[]> {
    return this.find({
      where: {
        userId: user.id,
      },
    })
  },
})

export default PlaceRepository
