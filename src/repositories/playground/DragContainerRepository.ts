import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { DragContainer } from "../../entities/playground/DragContainer";

export const getDragContainerRepo = () =>
  getCustomRepository(DragContainerRepository);

@EntityRepository(DragContainer)
export default class DragContainerRepository extends Repository<DragContainer> {
  async findOneFull(dragContainerid: number) {
    return this.findOne({
      where: { id: dragContainerid },
      relations: ["dragItems" as keyof DragContainer],
    });
  }

  async findAllFullFromUserId(userId: number) {
    return this.find({
      where: { userId },
      relations: ["dragItems" as keyof DragContainer],
    });
  }
}
