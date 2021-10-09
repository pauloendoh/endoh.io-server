import { Request, Response } from "express";
import { Resource } from "express-automatic-routes";

export default function dragItemsRoute() {
  return <Resource>{
    get: (req: Request, response: Response) => {
      response.json(req.params);
    },
  };
}
