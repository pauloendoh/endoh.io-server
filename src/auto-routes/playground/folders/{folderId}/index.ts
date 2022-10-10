import { Application } from "express"
import { Resource } from "express-automatic-routes"

export default function folderRoute(expressApp: Application) {
  return <Resource>{
    // delete: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const folderId = Number(req.params.folderId);
    //       const { affected } = await getTreeRepository(Folder).delete({
    //         userId: req.user.id,
    //         id: folderId,
    //       });
    //       if (affected === 0)
    //         return res.status(400).json(new NotFoundErrorResponse());
    //       const userFolders = await findFoldersFromUser(req.user.id);
    //       return res.json(userFolders);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
