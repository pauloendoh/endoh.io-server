import { plainToClass } from "class-transformer";
import { Router } from "express";
import { getRepository } from "typeorm";
import { ChampionRadar } from "../../entities/LolRates/ChampionRadar";
import authMiddleware from "../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../utils/ErrorMessage";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { myConsoleError } from "../../utils/myConsoleError";

const championRadarRoute = Router();
const radarRepo = getRepository(ChampionRadar);

championRadarRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const playerChampions = await radarRepo.find({
      where: { userId: req.user.id },
    });

    return res.status(200).json(playerChampions);
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

championRadarRoute.post(
  "/",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const sentRadar = plainToClass(ChampionRadar, req.body);
      sentRadar.userId = req.user.id;

      const saved = await radarRepo.save(sentRadar);

      return res.status(200).json(saved);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

championRadarRoute.put("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const sentRadar = plainToClass(ChampionRadar, req.body);

    const found = await radarRepo.findOne({
      where: { id: sentRadar.id, userId: req.user.id },
    });
    if (!found)
      return res
        .status(400)
        .json(new MyErrorsResponse("Now owner or not exists"));

    const saved = await radarRepo.save(sentRadar);

    return res.status(200).json(saved);
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

export default championRadarRoute;
