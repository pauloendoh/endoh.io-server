import { DocService } from "./doc/DocService"
import { gotItContract } from "./got-it/got-it.contract"
import { gotItController } from "./got-it/got-it.controller"
import { RecurrentLearningRepository } from "./learning-diary/recurrent-learning/RecurrentLearningRepository"

const repo = RecurrentLearningRepository
const service = new DocService()

const contract = gotItContract
const controller = gotItController
