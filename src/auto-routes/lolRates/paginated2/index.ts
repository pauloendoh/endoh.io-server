import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getManager } from "typeorm";
import { Resource as ResourceEntity } from "../../../entities/relearn/Resource";

export default function lolRatesPaginated2Route(expressApp: Application) {
  return <Resource>{
    get: async (req: Request, res: Response) => {
      try {
        const resources = await getManager()
          .createQueryBuilder()
          .select("resource")
          .from(ResourceEntity, "resource")
          .paginate();

        return res.json(resources);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },
  };
}
