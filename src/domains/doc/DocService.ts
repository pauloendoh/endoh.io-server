import { ForbiddenError } from "routing-controllers";
import { getDocRepository } from "../../repositories/define/DocRepository";

export class DocService {
  constructor(private docRepository = getDocRepository()) {}

  async deleteDoc(docId: number, requesterId: number) {
    const isAllowed = await this.docRepository.userOwnsDoc(requesterId, docId);
    if (!isAllowed)
      throw new ForbiddenError("User can't change doc or doc does not exist.");

    return this.docRepository.delete(docId);
  }
}
