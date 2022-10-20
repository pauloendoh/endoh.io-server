import { Repository } from "typeorm"
import { dataSource } from "../dataSource"
import { Skill } from "../entities/skillbase/Skill"
import { SkillHistory } from "../entities/skillbase/SkillHistory"
import SkillRepository from "../repositories/skillbase/SkillRepository"
import SkillProgressDto from "../types/domain/skillbase/skill-progress/SkillProgressDto"

export default class SkillHistoryService {
  historyRepo: Repository<SkillHistory>
  skillRepo: Repository<Skill>

  constructor(
    historyRepo = dataSource.getRepository(SkillHistory),
    skillRepo = SkillRepository
  ) {
    this.historyRepo = historyRepo
    this.skillRepo = skillRepo
  }

  async saveCurrentSkillHistory(userId: number) {
    const skills = await this.skillRepo.find({ where: { userId } })

    const histories: Partial<SkillHistory>[] = skills.map((skill) => ({
      userId,
      skillId: skill.id,
      skillName: skill.name,
      createdAt: undefined,
      currentLevel: skill.currentLevel,
    }))

    const savedHistories = await this.historyRepo.save(histories)
    return savedHistories
  }

  async findFromMonth(params: { userId: number; year: number; month: number }) {
    const query = this.historyRepo
      .createQueryBuilder()
      .where('"userId" = :userId', { userId: params.userId })
      .andWhere("to_char(\"createdAt\", 'YYYY-MM') = :yearMonth", {
        yearMonth: `${params.year}-${String(params.month).padStart(2, "0")}`,
      })

    const skillHistories = await query.getMany()

    return skillHistories
  }

  async findHistoryMonthsFromUser(userId: number) {
    const months = await this.historyRepo
      .createQueryBuilder()
      .select("to_char(\"createdAt\", 'YYYY-MM-dd') as month")
      .distinct()
      .where('"userId" = :userId', { userId })
      .orderBy("month", "DESC")
      .distinct(true)
      .getRawMany<{ month: string }>()

    return months.map((month) => month.month)
  }

  async findProgressFrom(
    userId: number,
    fromYearMonth: string
  ): Promise<SkillProgressDto[]> {
    return this.historyRepo.query(
      `
		SELECT
      s.id AS "skillId", 
      sh."skillName" AS "previousName", 
      s."name" AS "currentName", 
      sh."currentLevel" AS "previousLevel",
      s."currentLevel" AS "currentLevel", 
      (s."currentLevel" - COALESCE (sh."currentLevel", 0) ) AS "levelImprovement"
    FROM
      skill s
    INNER JOIN skill_history sh ON
      sh."skillId" = s.id AND sh."currentLevel" IS NOT NULL
    WHERE
      s."userId" = $1
      AND to_char(sh."createdAt", 'YYYY-MM-dd') = $2
      AND COALESCE(s."currentLevel", 0) != COALESCE(sh."currentLevel", 0)
    ORDER BY
      "levelImprovement" DESC NULLS LAST`,
      [userId, fromYearMonth]
    )
  }
}
