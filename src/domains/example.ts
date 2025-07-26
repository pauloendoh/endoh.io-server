import { questionContract } from "./define/questionContract"
import { DocController } from "./doc/DocController"
import { DocService } from "./doc/DocService"
import { RecurrentLearningRepository } from "./learning-diary/recurrent-learning/RecurrentLearningRepository"

const repo = RecurrentLearningRepository
const service = new DocService()
const controller = new DocController()

const contract = questionContract
