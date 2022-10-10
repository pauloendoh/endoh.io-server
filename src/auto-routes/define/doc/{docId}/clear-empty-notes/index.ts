import { Application } from "express"
import { Resource } from "express-automatic-routes"

export default function removeEmptyNotesRoute(expressApp: Application) {
  return <Resource>{
    // delete: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     const docId = Number(req.params.docId);
    //     try {
    //       const noteRepo = getNoteRepository();
    //       await noteRepo.removeEmptyNotesFromDocId(docId, req.user.id);
    //       const allNotes = await noteRepo.getAllNotesFromUserId(req.user.id);
    //       return res.json(allNotes);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
