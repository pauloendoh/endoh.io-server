import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { Doc } from "../../../entities/define/Doc";
import authMiddleware from "../../../middlewares/authMiddleware";
import { getDocRepository } from "../../../repositories/define/DocRepository";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function docRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const allDocs = await getDocRepository().getAllDocsFromUserId(
            req.user.id
          );
          return res.status(200).json(allDocs);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const sentDoc = req.body as Doc;
        const { user } = req;

        try {
          if (sentDoc.id) {
            const doc = await getDocRepository().findOne({
              where: { id: sentDoc.id, userId: user.id },
            });

            if (!doc)
              return res
                .status(400)
                .json(
                  new MyErrorsResponse(
                    `Doc doesn't exist or user doesn't own it.`
                  )
                );

            doc.title = sentDoc.title;
            const savedDoc = await getDocRepository().save(doc);
            return res.status(200).json(savedDoc);
          }

          const newDoc = new Doc();
          newDoc.title = sentDoc.title;
          newDoc.userId = user.id;

          const savedDoc = await getDocRepository().save(newDoc);
          return res.status(200).json(savedDoc);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
