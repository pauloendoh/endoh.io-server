import { getManager } from "typeorm";
import DragItemRepository from "../../../../repositories/playground/DragItemRepository";
import { INewDragItemPosition } from "../../../../types/domain/playground/drag-item/INewDragItemPosition";

export const saveItemPositions = async (
  newPositions: INewDragItemPosition[]
) => {
  await getManager().transaction(async (manager) => {
    try {
      const repo = manager.getCustomRepository(DragItemRepository);

      for (let newPosition of newPositions) {
        await repo.update(
          { id: newPosition.id },
          {
            containerId: newPosition.containerId,
            position: newPosition.position,
          }
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  });
};
