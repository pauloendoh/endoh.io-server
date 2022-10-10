import { Application } from "express"
import { Resource } from "express-automatic-routes"

export default function tagLastOpenedAtRoute(expressApp: Application) {
  return <Resource>{
    // put: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     const tagId = Number(req.params.tagId);
    //     try {
    //       const found = await checkOwnershipAsync(req.user.id, tagId, Tag);
    //       if (!found) {
    //         return res.json(new NotFoundErrorResponse());
    //       }
    //       found.lastOpenedAt = new Date().toISOString();
    //       const saved = await getTagRepository().save(found);
    //       const savedFull = await getTagRepository().getFullTagFromUser(
    //         saved.id,
    //         req.user.id
    //       );
    //       return res.json(savedFull);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
