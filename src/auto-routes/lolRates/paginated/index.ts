import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository";

export default function lolRatesRoute(expressApp: Application) {
  return <Resource>{
    get: async (req: Request, res: Response) => {
      try {
        const query = req.query as { page: string; limit: string };
        const page = Number(query.page);
        const limit = Number(query.limit);

        const lolRateRepo = getCustomRepository(LolRateRepository);

        const allWinrates = await lolRateRepo.findWinrates();

        // https://www.youtube.com/watch?v=ZX3qt0UWifc
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {
          next: undefined,
          previous: undefined,
          finalPage: Math.floor(allWinrates.length / limit) + 1,
          results: undefined,
        };

        if (endIndex < allWinrates.length) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }

        results.results = allWinrates.slice(startIndex, endIndex);

        return res.json(results);
      } catch (err) {
        return res.status(400).json(err);
      }
    },
  };
}
