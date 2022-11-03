import { ForbiddenError } from "routing-controllers"
import { Doc } from "../../entities/define/Doc"
import { getDocRepository } from "../../repositories/define/DocRepository"

export class DocService {
  constructor(private docRepository = getDocRepository()) {}

  async deleteDoc(docId: number, requesterId: number) {
    const isAllowed = await this.docRepository.userOwnsDoc(requesterId, docId)
    if (!isAllowed)
      throw new ForbiddenError("User can't change doc or doc does not exist.")

    return this.docRepository.delete(docId)
  }

  async createDoc(sentDoc: Doc, requesterId: number) {
    const newDoc = new Doc()
    newDoc.title = sentDoc.title
    newDoc.userId = requesterId
    newDoc.folderId = sentDoc.folderId

    const savedDoc = await this.docRepository.save(newDoc)
    return savedDoc
  }
}
