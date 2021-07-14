import { getCustomRepository, getRepository } from 'typeorm'
import { DecisionTable } from '../../entities/BigDecisions/DecisionTable'
import createExampleDecision from '../../utils/domain/BigDecisions/createExampleDecision'
import createOrmConn from '../../utils/typeOrm/createOrmConn'
import createExampleUser from '../../utils/user/createExampleUser'

beforeAll(async ()=>{
    // wipes database 
    await createOrmConn()
})

test("Create decision table as last index", async() => {
    const user = await createExampleUser('test')
    const decision = await createExampleDecision(user, 'decision')
    // new decision = automatically 2 new tables (index 0 and 1)

    const tableRepo = await getRepository(DecisionTable)
    const table2 = await tableRepo.save({decision, user, title: 'xd' })
    const table3 = await tableRepo.save({decision, user, title: 'xd'})

    
    expect(table2.index).toBe(2)
    expect(table3.index).toBe(3)

})