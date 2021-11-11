import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { Note } from "../../../entities/define/Note";
import authMiddleware from "../../../middlewares/authMiddleware";
import { getNoteRepository } from "../../../repositories/define/NoteRepository";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function noteRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const allNotes = await getNoteRepository().getAllNotesFromUserId(
            req.user.id
          );
          return res.status(200).json(allNotes);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { user } = req;
        const sentNote = req.body as Note;

        try {
          if (sentNote.id) {
            //ownership
            const found = await getNoteRepository().findOne({
              where: { userId: user.id, id: sentNote.id },
            });

            if (!found)
              return res
                .status(400)
                .json(
                  new MyErrorsResponse(
                    "Note doesn't exist or user is not owner"
                  )
                );
          }

          const savedNote = await getNoteRepository().save(sentNote);
          return res.status(200).json(savedNote);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
