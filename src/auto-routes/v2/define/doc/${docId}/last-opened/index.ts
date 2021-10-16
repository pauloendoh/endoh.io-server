import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { Doc } from "../../../../../../entities/define/Doc";
import authMiddleware from "../../../../../../middlewares/authMiddleware";
import { getDocRepository } from "../../../../../../repositories/define/DocRepository";
import checkOwnershipAsync from "../../../../../../utils/domain/checkOwnership";
import { MyErrorsResponse } from "../../../../../../utils/ErrorMessage";
import { NotFoundErrorResponse } from "../../../../../../utils/errors/NotFoundErrorResponse";
import { MyAuthRequest } from "../../../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../../../utils/myConsoleError";

export default function docLastOpenedAtRoute(expressApp: Application) {
  return <Resource>{
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const docId = Number(req.params.docId);

        try {
          const found = await checkOwnershipAsync(req.user.id, docId, Doc);

          if (!found) return res.json(new NotFoundErrorResponse());

          found.lastOpenedAt = new Date().toISOString();
          const saved = await getDocRepository().save(found);
          return res.json(saved);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
