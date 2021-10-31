import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { DragItem } from "../../entities/playground/DragItem";

export const getDragItemRepo = () => getCustomRepository(DragItemRepository);

@EntityRepository(DragItem)
export default class DragItemRepository extends Repository<DragItem> {}
