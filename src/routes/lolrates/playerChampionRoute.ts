import { plainToClass } from "class-transformer";
import { Router } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { PlayerChampion } from "../../entities/LolRates/PlayerChampion";
import authMiddleware from "../../middlewares/authMiddleware";
import PlayerRepo from "../../repositories/lolrates/PlayerRepo";
import { MyErrorsResponse } from "../../utils/ErrorMessage";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { myConsoleError } from "../../utils/myConsoleError";

const playerChampionRoute = Router();
const playerChampionRepo = getRepository(PlayerChampion);
const playerRepo = getCustomRepository(PlayerRepo);

playerChampionRoute.post(
  "/",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const sentPlayerChampion = plainToClass(PlayerChampion, req.body);
      sentPlayerChampion.userId = req.user.id;

      const saved = await playerChampionRepo.save(sentPlayerChampion);

      return res.status(200).json(saved);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

playerChampionRoute.get(
  "/",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const playerChampions = await playerChampionRepo.find({
        where: { userId: req.user.id },
      });

      return res.status(200).json(playerChampions);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

export default playerChampionRoute;
