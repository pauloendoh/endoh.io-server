import { EntityRepository, Repository } from "typeorm";
import { Player } from "../../entities/LolRates/Player";

@EntityRepository(Player)
export default class PlayerRepo extends Repository<Player> {
  // PE 2/3
  async findAllFullByUserId(userId: number) {
    return this.find({
      where: { userId },
      relations: ["champions", "champions.champion"],
      order: { name: "ASC" },
    });
  }

  async findOneFull(id: number) {
    return this.findOne({
      where: { id },
      relations: ["champions", "champions.champion"],
    });
  }
}
