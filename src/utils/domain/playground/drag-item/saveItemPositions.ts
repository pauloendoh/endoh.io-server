import { dataSource } from "../../../../dataSource"
import { DragItem } from "../../../../entities/playground/DragItem"
import { INewDragItemPosition } from "../../../../types/domain/playground/drag-item/INewDragItemPosition"
import { myConsoleError } from "../../../myConsoleError"

export const saveItemPositions = async (
  newPositions: INewDragItemPosition[]
) => {
  await dataSource.transaction(async (manager) => {
    try {
      const repo = manager.getRepository(DragItem)

      for (let newPosition of newPositions) {
        await repo.update(
          { id: newPosition.id },
          {
            containerId: newPosition.containerId,
            position: newPosition.position,
          }
        )
      }
    } catch (err) {
      myConsoleError(err.message)
    }
  })
}
