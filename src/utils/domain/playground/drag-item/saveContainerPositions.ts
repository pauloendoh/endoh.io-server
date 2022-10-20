import { getManager } from "typeorm"
import DragContainerRepository from "../../../../repositories/playground/DragContainerRepository"
import { INewDragContainerPosition } from "../../../../types/domain/playground/drag-container/INewDragContainerPosition"
import { myConsoleError } from "../../../myConsoleError"

export const saveContainerPositions = async (
  newPositions: INewDragContainerPosition[]
) => {
  await getManager().transaction(async (manager) => {
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
