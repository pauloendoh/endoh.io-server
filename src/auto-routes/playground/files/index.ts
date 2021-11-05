import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { File } from "../../../entities/playground/file-system/File";
import authMiddleware from "../../../middlewares/authMiddleware";
import findFoldersFromUser from "../../../utils/domain/playground/file-system/findFoldersFromUser";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { NotFoundErrorResponse } from "../../../utils/errors/NotFoundErrorResponse";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function filesRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sent = req.body as File;
          sent.userId = req.user.id;
          await getRepository(File).save(sent);

          const userFolders = await findFoldersFromUser(req.user.id);

          return res.json(userFolders);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },

    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sent = req.body as File;

          const found = await getRepository(File).findOne({
            userId: req.user.id,
            id: sent.id,
          });

          if (!found) return res.json(401).json(new NotFoundErrorResponse());

          await getRepository(File).save(sent);

          const userFolders = await findFoldersFromUser(req.user.id);

          return res.json(userFolders);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },

    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const folderRepo = getTreeRepository(Folder);

    //       const allFolders = await folderRepo.findTrees({
    //         relations: ["files" as keyof Folder],
    //       });
    //       const userFolders = allFolders.filter(
    //         (folder) => folder.userId === req.user.id
    //       );

    //       return res.json(userFolders);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  };
}
