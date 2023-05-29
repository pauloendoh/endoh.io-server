import { dataSource } from "../../dataSource"
import { User } from "../../entities/User"

export class UserRepositoryV2 {
  constructor(private db = dataSource) {}

  async findById(id: number) {
    return this.db.getRepository(User).findOne({
      where: {
        id,
      },
    })
  }
}
