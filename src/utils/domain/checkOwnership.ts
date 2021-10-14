import { EntityTarget, getRepository } from "typeorm";

export default async function checkOwnershipAsync<T>(
  userId: number,
  id: number,
  entityClass: EntityTarget<T>
) {
  return await getRepository(entityClass).findOne({ where: { userId, id } });
}
