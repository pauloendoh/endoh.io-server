import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import authMiddleware from "../../../../middlewares/authMiddleware";
import { INewDragItemPosition } from "../../../../types/domain/playground/drag-item/INewDragItemPosition";
import { saveItemPositions } from "../../../../utils/domain/playground/drag-item/saveItemPositions";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function dragItemPositionRoute(expressApp: Application) {
  return <Resource>{
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const newPositions = req.body as INewDragItemPosition[];
          await saveItemPositions(newPositions);

          return res.status(200).json({ message: "nice" });
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
