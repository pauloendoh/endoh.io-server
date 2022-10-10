import { Application } from "express";
import { Resource } from "express-automatic-routes";

export default function manyNotesRoute(expressApp: Application) {
  return <Resource>{
    // post: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     const { user } = req;
    //     const sentNotes = req.body as Note[];

    //     try {
    //       const isOwner = await getNoteRepository().isOwner(sentNotes, user.id);
    //       if (!isOwner)
    //         return res
    //           .status(400)
    //           .json(new MyErrorsResponse("User is not owner of all notes."));

    //       await getNoteRepository().save(sentNotes);
    //       const allNotes = await getNoteRepository().getAllNotesFromUserId(
    //         user.id
    //       );
    //       return res.status(200).json(allNotes);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  };
}
