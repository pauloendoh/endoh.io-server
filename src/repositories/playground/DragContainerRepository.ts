import { dataSource } from "../../dataSource"
import { DragContainer } from "../../entities/playground/DragContainer"

export const getDragContainerRepo = () => DragContainerRepository

const DragContainerRepository = dataSource.getRepository(DragContainer).extend({
  async findOneFull(dragContainerid: number) {
    return this.findOne({
      where: { id: dragContainerid },
      relations: ["dragItems" as keyof DragContainer],
    })
  },

  async findAllFullFromUserId(userId: number) {
    return this.find({
      where: { userId },
      relations: ["dragItems" as keyof DragContainer],
    })
  },
})

export default DragContainerRepository
