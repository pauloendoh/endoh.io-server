import { Router } from "express"
import { getCustomRepository } from "typeorm"
import { Doc } from "../../entities/define/Doc"
import { Note } from "../../entities/define/Note"
import authMiddleware from "../../middlewares/authMiddleware"
import DocRepository from "../../repositories/define/DocRepository"
import NoteRepository from "../../repositories/define/NoteRepository"
import { MyErrorsResponse } from "../../utils/ErrorMessage"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { myConsoleError } from "../../utils/myConsoleError"

const docRoute = Router()

const docRepository = getCustomRepository(DocRepository)

docRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const allDocs = await docRepository.getAllDocsFromUserId(req.user.id)
    return res.status(200).json(allDocs)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

docRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
  const sentDoc = req.body as Doc
  const { user } = req

  try {
    if (sentDoc.id) {
      // TODO
      // check ownership
      const doc = await docRepository.findOne({
        where: { id: sentDoc.id, userId: user.id },
      })

      if (!doc) {
        return res
          .status(400)
          .json(
            new MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`)
          )
      }

      doc.title = sentDoc.title
      const savedDoc = await docRepository.save(doc)
      return res.status(200).json(savedDoc)
    } else {
      const newDoc = new Doc()
      newDoc.title = sentDoc.title
      newDoc.userId = user.id

      const savedDoc = await docRepository.save(newDoc)
      return res.status(200).json(savedDoc)
    }

    // const allUserDocs = await docRepository.getAllDocsFromUserId(user.id)
    // return res.status(200).json(allUserDocs)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

export default docRoute
