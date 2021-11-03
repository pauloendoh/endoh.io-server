import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import LolRateRepository from "../../repositories/lolrates/LolRateRepository";

export default function lolRatesRoute(expressApp: Application) {
  return <Resource>{
    get: async (request: Request, res: Response) => {
      try {
        const lolRateRepo = getCustomRepository(LolRateRepository);

        const allWinrates = await lolRateRepo.findWinrates();
        const updatedAt = await lolRateRepo.getUpdatedAt();

        return res.json({ rates: allWinrates, updatedAt: updatedAt[0] });
      } catch (err) {
        return res.status(400).json(err);
      }
    },
  };
}
