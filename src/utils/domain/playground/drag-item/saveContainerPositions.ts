import { getManager } from "typeorm";
import DragContainerRepository from "../../../../repositories/playground/DragContainerRepository";
import { INewDragContainerPosition } from "../../../../types/domain/playground/drag-container/INewDragItemPosition copy";

export const saveContainerPositions = async (
  newPositions: INewDragContainerPosition[]
) => {
  await getManager().transaction(async (manager) => {
    try {
      const repo = manager.getCustomRepository(DragContainerRepository);

      for (let newPosition of newPositions) {
        await repo.update(
          { id: newPosition.containerId },
          {
            position: newPosition.position,
          }
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  });
};
