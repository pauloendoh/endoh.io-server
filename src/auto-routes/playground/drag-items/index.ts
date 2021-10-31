import { plainToClass } from "class-transformer";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { DragItem } from "../../../entities/playground/DragItem";
import authMiddleware from "../../../middlewares/authMiddleware";
import { getDragItemRepo } from "../../../repositories/playground/DragItemRepository";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function dragContainerRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sentDragItem = plainToClass(DragItem, req.body);

          const lastPosition = await getDragItemRepo().count({
            where: {
              userId: req.user.id,
              containerId: sentDragItem.containerId,
            },
          });

          sentDragItem.userId = req.user.id;
          sentDragItem.position = lastPosition;

          const saved = await getDragItemRepo().save(sentDragItem);
          return res.json(saved);
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
          const dragItems = await getDragItemRepo().find({
            where: { userId: req.user.id },
          });
          return res.json(dragItems);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
