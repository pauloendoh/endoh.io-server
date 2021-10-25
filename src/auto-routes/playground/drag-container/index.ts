import { plainToClass } from "class-transformer";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { DragContainer } from "../../../entities/playground/DragContainer";
import authMiddleware from "../../../middlewares/authMiddleware";
import { getDragContainerRepo } from "../../../repositories/playground/DragContainerRepository";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function dragContainerRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sentContainer = plainToClass(DragContainer, req.body);
          sentContainer.userId = req.user.id;
          const saved = await getDragContainerRepo().save(sentContainer);
          const savedFull = await getDragContainerRepo().findOneFull(saved.id);
          return res.json(savedFull);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
