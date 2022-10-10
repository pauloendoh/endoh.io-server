import { Application } from "express";
import { Resource } from "express-automatic-routes";

export default function progressMonthsRoute(expressApp: Application) {
  return <Resource>{
    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const service = new SkillHistoryService();
    //       const months = await service.findHistoryMonthsFromUser(req.user.id);
    //       return res.json(months);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  };
}
