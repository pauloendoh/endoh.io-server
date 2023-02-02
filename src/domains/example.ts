import DocRepository from "../repositories/define/DocRepository"
import { DocController } from "./doc/DocController"
import { DocService } from "./doc/DocService"

const repo = DocRepository
const service = new DocService()
const controller = new DocController()
