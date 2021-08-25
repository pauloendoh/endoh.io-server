import { Router } from "express";
import { getRepository } from "typeorm";
import { Champion } from "../../entities/LolRates/Champion";
import authMiddleware from "../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../utils/ErrorMessage";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { myConsoleError } from "../../utils/myConsoleError";

const championRoute = Router();
const championRepo = getRepository(Champion);

championRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const champions = await championRepo.find({ order: { name: "ASC" } });
    return res.status(200).json(champions);
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

export default championRoute;
