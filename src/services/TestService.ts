import { getManager } from "typeorm";
import { Test } from "../entities/Test";

export default abstract class TestService {
  static getAllEntities = async () => [];

  static saveAsync = async (test: Test) => {
    return await getManager().transaction(async (manager) => {
      return await manager.save(test);
    });
  };
}
