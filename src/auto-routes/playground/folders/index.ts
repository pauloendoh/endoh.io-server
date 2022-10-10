import { Application } from "express"
import { Resource } from "express-automatic-routes"

export default function folderRoute(expressApp: Application) {
  return <Resource>{
    // post: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const sent = plainToClass(Folder, req.body);
    //       sent.userId = req.user.id;
    //       // it looks like parentFolderId doesn't work on saving
    //       if (sent.parentFolderId) {
    //         const parentFolder = await getRepository(Folder).findOne({
    //           where: { id: sent.parentFolderId },
    //         });
    //         sent.parentFolder = parentFolder;
    //       }
    //       const folderRepo = getTreeRepository(Folder);
    //       await folderRepo.save(sent);
    //       const userFolders = await findFoldersFromUser(req.user.id);
    //       return res.json(userFolders);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
    // put: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const sent = req.body as Folder;
    //       const found = await getTreeRepository(Folder).findOne({
    //         userId: req.user.id,
    //         id: sent.id,
    //       });
    //       if (!found) return res.json(401).json(new NotFoundErrorResponse());
    //       sent.userId = req.user.id;
    //       if (sent.parentFolderId) {
    //         const parentFolder = await getRepository(Folder).findOne({
    //           where: { id: sent.parentFolderId },
    //         });
    //         sent.parentFolder = parentFolder;
    //       }
    //       await getTreeRepository(Folder).save(sent);
    //       const userFolders = await findFoldersFromUser(req.user.id);
    //       return res.json(userFolders);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const service = new FolderService();
    //       const userFolders = await service.findFoldersFromUser(req.user.id);
    //       return res.json(userFolders);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
    // delete: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const sent = req.body as Folder;
    //       const { affected } = await getTreeRepository(Folder).delete({
    //         userId: req.user.id,
    //         id: sent.id,
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
