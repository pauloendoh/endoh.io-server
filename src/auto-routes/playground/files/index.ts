import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository, getTreeRepository } from "typeorm";
import { File } from "../../../entities/playground/file-system/File";
import { Folder } from "../../../entities/playground/file-system/Folder";
import authMiddleware from "../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
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

          // PE 1/3 - DRY (but its not possible to create custom tree repos?)
          const allFolders = await getTreeRepository(Folder).findTrees({
            relations: ["files" as keyof Folder],
          });
          const userFolders = allFolders.filter(
            (folder) => folder.userId === req.user.id
          );

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
