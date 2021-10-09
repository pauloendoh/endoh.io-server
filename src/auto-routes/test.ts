import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { Test } from "../entities/Test";
import { getNotOwnerResponse } from "../utils/responses/getNotOwnerResponse";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    post: async (req: Request, res: Response) => {
      const newTest = Test.create({
        userId: 2,
        name: "Example",
        color: "",
      });
      const saved = await newTest.save();
      res.json(saved);
    },
    get: async (request: Request, res: Response) => {
      try {
        const resource = await Test.checkOwnershipAsync(2, 5);

        if (!resource) return getNotOwnerResponse(res);

        return res.json(resource);
      } catch (err) {
        return res.status(400).json(err);
      }
    },
  };
}
