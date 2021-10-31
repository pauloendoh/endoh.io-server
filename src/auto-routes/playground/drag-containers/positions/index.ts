import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import authMiddleware from "../../../../middlewares/authMiddleware";
import { INewDragContainerPosition } from "../../../../types/domain/playground/drag-container/INewDragContainerPosition";
import { saveContainerPositions } from "../../../../utils/domain/playground/drag-item/saveContainerPositions";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function dragItemPositionRoute(expressApp: Application) {
  return <Resource>{
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const newPositions = req.body as INewDragContainerPosition[];
          await saveContainerPositions(newPositions);

          return res.status(200).json({ message: "nice" });
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
