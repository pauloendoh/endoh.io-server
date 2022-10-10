import { Resource } from "express-automatic-routes"

export default function feedResourceRoute() {
  return <Resource>{
    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     try {
    //       const feedResources = await getFollowingTagRepo().findFeedResources(
    //         req.user
    //       );
    //       return res.json(feedResources);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
