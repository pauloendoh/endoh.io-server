import { Router } from "express"
import { getCustomRepository } from "typeorm"
import { Note } from "../../entities/define/Note"
import authMiddleware from "../../middlewares/authMiddleware"
import NoteRepository from "../../repositories/define/NoteRepository"
import { MyErrorsResponse } from "../../utils/ErrorMessage"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { myConsoleError } from "../../utils/myConsoleError"

const noteRoute = Router()

const noteRepo = getCustomRepository(NoteRepository)

noteRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const allNotes = await noteRepo.getAllNotesFromUserId(req.user.id)
    return res.status(200).json(allNotes)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

noteRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
  const { user } = req
  const sentNote = req.body as Note

  try {
    if (sentNote.id) {
      //ownership
      const found = await noteRepo.findOne({
        where: { userId: user.id, id: sentNote.id },
      })

      if (!found)
        return res
          .status(400)
          .json(new MyErrorsResponse("Note doesn't exist or user is not owner"))
    }

    const savedNote = await noteRepo.save(sentNote)
    return res.status(200).json(savedNote)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

noteRoute.post("/many", authMiddleware, async (req: MyAuthRequest, res) => {
  const { user } = req
  const sentNotes = req.body as Note[]

  try {
    const isOwner = await noteRepo.isOwner(sentNotes, user.id)
    if (!isOwner)
      return res
        .status(400)
        .json(new MyErrorsResponse("User is not owner of all notes."))

    await noteRepo.save(sentNotes)
    const allNotes = await noteRepo.getAllNotesFromUserId(user.id)
    return res.status(200).json(allNotes)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

export default noteRoute
