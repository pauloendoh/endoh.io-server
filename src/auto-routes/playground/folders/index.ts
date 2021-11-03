import { plainToClass } from "class-transformer";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository, getTreeRepository } from "typeorm";
import { Folder } from "../../../entities/playground/file-system/Folder";
import authMiddleware from "../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function folderRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sent = plainToClass(Folder, req.body);
          sent.userId = req.user.id;

          // it looks like parentFolderId doesn't work on saving
          if (sent.parentFolderId) {
            const parentFolder = await getRepository(Folder).findOne({
              where: { id: sent.parentFolderId },
            });
            sent.parentFolder = parentFolder;
          }

          const folderRepo = getTreeRepository(Folder);
          await folderRepo.save(sent);

          const allFolders = await folderRepo.findTrees({
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

    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const folderRepo = getTreeRepository(Folder);

          const allFolders = await folderRepo.findTrees({
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
  };
}
