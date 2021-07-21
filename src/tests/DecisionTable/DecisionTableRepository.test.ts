import { getCustomRepository, getRepository } from "typeorm"
import { DecisionTable } from "../../entities/BigDecisions/DecisionTable"
import DecisionTableRepository from "../../repositories/BigDecisions/DecisionTableRepository"
import UserRepository from "../../repositories/UserRepository"
import createExampleDecision from "../../utils/domain/BigDecisions/createExampleDecision"
import createOrmConn from "../../utils/typeOrm/createOrmConn"

beforeEach(async () => {
  // wipes database
  await createOrmConn()
})

test("Normalize decision tables index", async () => {
  const user = await getCustomRepository(UserRepository).createUserForUnitTests(
    "test"
  )
  const decision = await createExampleDecision(user, "decision")

  // automatically adds two tables on creation

  const tableRepo = getRepository(DecisionTable)
  await tableRepo.save({ decision, user, title: "xd", index: 2 })
  await tableRepo.save({ decision, user, title: "xd", index: 3 })

  const repo = getCustomRepository(DecisionTableRepository)
  const tables = await repo.find({ where: { decisionId: decision.id } })
  tables[2].index = 14
  tables[3].index = 17
  await repo.save(tables)
  await repo.normalizeTablesPositions(decision.id)

  const newTables = await repo.find({ where: { decisionId: decision.id } })

  expect(newTables[0].index).toBe(0)
  expect(newTables[1].index).toBe(1)
  expect(newTables[2].index).toBe(2)
  expect(newTables[3].index).toBe(3)
})
