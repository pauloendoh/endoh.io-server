import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getTagRepository } from "../../../repositories/relearn/TagRepository";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function dragContainerRoute(expressApp: Application) {
  return <Resource>{
    get: {
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const publicTags = await getTagRepository().find({
            where: {
              isPrivate: false,
            },
          });

          return res.json(publicTags);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
