import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { Champion } from "../../../entities/LolRates/Champion";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function lolRatesPaginated2Route(expressApp: Application) {
  return <Resource>{
    get: async (req: Request, res: Response) => {
      try {
        const championRepo = getRepository(Champion);
        const champions = await championRepo.find({ order: { name: "ASC" } });
        return res.status(200).json(champions);
      } catch (err) {
        myConsoleError(err.message);
        return res.status(400).json(new MyErrorsResponse(err.message));
      }
    },
  };
}
