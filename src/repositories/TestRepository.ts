import { EntityRepository, Repository } from "typeorm";
import { Test } from "../entities/Test";

@EntityRepository(Test)
export default class TestRepository extends Repository<Test> {
  async getOne() {
    return this.findOne();
  }
}
