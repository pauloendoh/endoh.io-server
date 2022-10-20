import { dataSource } from "../../dataSource"
import { Player } from "../../entities/LolRates/Player"

const PlayerRepo = dataSource.getRepository(Player).extend({
  async findAllFullByUserId(userId: number) {
    return this.find({
      where: { userId },
      relations: ["champions", "champions.champion"],
      order: { name: "ASC" },
    })
  },

  async findOneFull(id: number) {
    return this.findOne({
      where: { id },
      relations: ["champions", "champions.champion"],
    })
  },
})

export default PlayerRepo
