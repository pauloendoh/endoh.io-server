import { getCustomRepository } from 'typeorm'
import { User } from '../../../entities/User'
import DecisionRepository from '../../../repositories/BigDecisions/DecisionRepository'

const createExampleDecision = async (user: User, title: string ) => {


    const repo = getCustomRepository(DecisionRepository)
    const saved = await repo.save({title, user})

    return saved 
}

export default createExampleDecision