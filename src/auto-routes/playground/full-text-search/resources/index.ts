import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import authMiddleware from "../../../../middlewares/authMiddleware";
import { getResourceRepository } from "../../../../repositories/relearn/ResourceRepository";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function searchRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const { query } = req.query as { query: string };
          if (query?.length === 0) return res.json([]);

          const resourcesRepo = getResourceRepository();
          const resources = await resourcesRepo.fullTextSearch(
            req.user.id,
            query
          );

          return res.status(200).json(resources);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
