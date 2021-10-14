import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import TestRepository from "../repositories/TestRepository";
import { getNotOwnerResponse } from "../utils/responses/getNotOwnerResponse";

const testRepo = getCustomRepository(TestRepository);

export default function testRoute(expressApp: Application) {
  return <Resource>{
    post: async (req: Request, res: Response) => {
      // const newTest = Test.create({
      //   userId: 2,
      //   name: "Example",
      //   color: "",
      // });
      // const saved = await newTest.save();
      // res.json(saved);
    },
    get: async (request: Request, res: Response) => {
      try {
        const resource = await testRepo.findOne({
          id: 5,
          userId: 2,
        });

        if (!resource) return getNotOwnerResponse(res);

        const one = await testRepo.getOne();
        return res.json(one);
        // TestService.saveAsync();

        // return res.json(resource);
      } catch (err) {
        return res.status(400).json(err);
      }
    },
  };
}
