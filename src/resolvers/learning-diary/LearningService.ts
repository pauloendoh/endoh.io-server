import { getRepository } from "typeorm";
import { Learning } from "../../entities/learning-diary/Learning";
import LearningAddInput from "./types/LearningAddInput";

export default class LearningService {
  constructor(private repo = getRepository(Learning)) {}

  findLearningsByUser = async (userId: number) => {
    return await this.repo.find({
      where: {
        userId,
      },
    });
  };

  addLearning = async (data: LearningAddInput, userId: number) => {
    return await this.repo.save({ ...data, userId });
  };
}
