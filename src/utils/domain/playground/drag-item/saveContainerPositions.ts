import { dataSource } from "../../../../dataSource"
import DragContainerRepository from "../../../../repositories/playground/DragContainerRepository"
import { INewDragContainerPosition } from "../../../../types/domain/playground/drag-container/INewDragContainerPosition"
import { myConsoleError } from "../../../myConsoleError"

export const saveContainerPositions = async (
  newPositions: INewDragContainerPosition[]
) => {
  await dataSource.manager.transaction(async (manager) => {
    try {
      const repo = DragContainerRepository

      for (let newPosition of newPositions) {
        await repo.update(
          { id: newPosition.containerId },
          {
            position: newPosition.position,
          }
        )
      }
    } catch (err) {
      myConsoleError(JSON.stringify(err))
    }
  })
}
