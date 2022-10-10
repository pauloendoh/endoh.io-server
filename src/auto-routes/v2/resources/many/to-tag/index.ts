import { Application } from "express"
import { Resource } from "express-automatic-routes"

interface IResourcesToTagId {
  resourceIds: number[]
  toTagId: number
}

export default function moveResourcesToTagRoute(expressApp: Application) {
  return <Resource>{
    // put: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     const data = req.body as IResourcesToTagId;
    //     const resourceRepo = getResourceRepository();
    //     try {
    //       await resourceRepo.moveResourcesToTag(
    //         data.resourceIds,
    //         data.toTagId,
    //         req.user.id
    //       );
    //       const allResources = await resourceRepo.findAllResourcesFromUser(
    //         req.user
    //       );
    //       return res.status(200).json(allResources);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
