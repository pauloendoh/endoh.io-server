import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Tag } from "../../entities/relearn/Tag";
import { Skill } from "../../entities/skillbase/Skill";
import { User } from "../../entities/User";

export const getSkillRepository = () => getCustomRepository(SkillRepository);

@EntityRepository(Skill)
export default class SkillRepository extends Repository<Skill> {
  async getAllFromUser(userId: number): Promise<Skill[]> {
    return this.createQueryBuilder("skill")
      .where({ userId: userId })
      .leftJoinAndSelect("skill.dependencies", "dependencies")
      .leftJoinAndSelect("skill.expectations", "expectations")
      .leftJoinAndSelect("skill.labels", "labels")
      .orderBy("skill.isPriority", "DESC")
      .addOrderBy("skill.goalLevel", "DESC")
      .addOrderBy("skill.currentLevel", "DESC")
      .addOrderBy("expectations.index", "ASC")
      .addOrderBy("labels.id", "ASC")
      .getMany();
  }

  async findPublicSkillsFromUser(userId: number) {
    return this.find({
      where: { isPublic: true, userId },
      relations: ["expectations"],
    });
  }

  async deleteIdsFromUser(ids: number[], userId: number) {
    return this.createQueryBuilder("skill")
      .delete()
      .where({ userId: userId })
      .andWhere("skill.id IN (:...ids)", { ids: [...ids] })
      .execute();
  }

  async getByText(userId: number, text: string): Promise<Skill[]> {
    return this.createQueryBuilder("skill")
      .where({ userId: userId })
      .andWhere("skill.name ilike :text", { text: `%${text}%` })
      .leftJoinAndSelect("skill.dependencies", "dependencies")
      .leftJoinAndSelect("skill.expectations", "expectations")
      .orderBy("skill.isPriority", "DESC")
      .addOrderBy("skill.goalLevel", "DESC")
      .addOrderBy("skill.currentLevel", "DESC")
      .getMany();
  }

  async createSkillsForNewUser(
    user: User,
    programmingTag: Tag
  ): Promise<Skill[]> {
    const skills: Skill[] = [];
    skills.push(
      await this.save({
        user,
        tag: programmingTag,
        isPriority: true,
        name: "[Example] JavaScript",
        currentLevel: 3,
        goalLevel: 5,
      })
    );

    skills.push(
      await this.save({
        user,
        isPriority: false,
        name: "[Example] League of Legends",
        currentLevel: 6,
        goalLevel: 7,
      })
    );

    return skills;
  }
}
