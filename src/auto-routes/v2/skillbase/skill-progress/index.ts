import { Application } from "express";
import { Resource } from "express-automatic-routes";

export default function progressMonthsRoute(expressApp: Application) {
  return <Resource>{
    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const { from: fromYearMonth } = req.query as { from: string };
    //       if (fromYearMonth?.length !== 10) return res.json([]);

    //       const service = new SkillHistoryService();
    //       const progresses = await service.findProgressFrom(
    //         req.user.id,
    //         fromYearMonth
    //       );
    //       return res.json(progresses);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  };
}
