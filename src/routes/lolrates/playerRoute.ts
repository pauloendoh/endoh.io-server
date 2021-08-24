import { plainToClass } from "class-transformer";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { Player } from "../../entities/LolRates/Player";
import authMiddleware from "../../middlewares/authMiddleware";
import PlayerRepo from "../../repositories/lolrates/PlayerRepo";
import { MyErrorsResponse } from "../../utils/ErrorMessage";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { myConsoleError } from "../../utils/myConsoleError";

const playerRoute = Router();
const playerRepo = getCustomRepository(PlayerRepo);

playerRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const players = await playerRepo.findByUserId(req.user.id);
    return res.status(200).json(players);
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

playerRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const sentPlayer = plainToClass(Player, req.body);
    sentPlayer.userId = req.user.id;

    const saved = await playerRepo.save(sentPlayer);
    return res.status(200).json(saved);
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

export default playerRoute;
