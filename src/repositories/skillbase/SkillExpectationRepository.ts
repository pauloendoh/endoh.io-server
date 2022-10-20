import { dataSource } from "../../dataSource"
import { Skill } from "../../entities/skillbase/Skill"
import { SkillExpectation } from "../../entities/skillbase/SkillExpectation"
import { User } from "../../entities/User"

const SkillExpectationRepository = dataSource
  .getRepository(SkillExpectation)
  .extend({
    async createExpectationsForNewUser(
      user: User,
      skills: Skill[]
    ): Promise<SkillExpectation[]> {
      const jsSkill = skills[0]
      const lolSkill = skills[1]

      const expectations: SkillExpectation[] = []

      expectations.push(
        await this.save({
          user,
          skill: jsSkill,
          level: 4,
          index: 0,
          description: "Learn TypeScript",
          checked: false,
        })
      )

      expectations.push(
        await this.save({
          user,
          skill: jsSkill,
          level: 3,
          index: 0,
          description: "Learn filter(), map(), slice() and splice()",
          checked: true,
        })
      )

      expectations.push(
        await this.save({
          user,
          skill: lolSkill,
          level: 10,
          index: 0,
          description: "Be at Faker and Dopa level",
          checked: false,
        })
      )

      expectations.push(
        await this.save({
          user,
          skill: lolSkill,
          level: 1,
          index: 0,
          description: "Turn on your monitor",
          checked: true,
        })
      )

      expectations.push(
        await this.save({
          user,
          skill: lolSkill,
          level: 7,
          index: 0,
          description: "Learn about 🌊 management",
          checked: false,
        })
      )

      return []
    },
  })

export default SkillExpectationRepository
