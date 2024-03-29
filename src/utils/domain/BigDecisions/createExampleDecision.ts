import { User } from "../../../entities/User"
import DecisionRepository from "../../../repositories/BigDecisions/DecisionRepository"

const createExampleDecision = async (user: User, title: string) => {
  const repo = DecisionRepository
  const saved = await repo.save({ title, userId: user.id })

  return saved
}

export default createExampleDecision
