import { Router } from "express";
import { getCustomRepository } from "typeorm";
import authMiddleware from "../../middlewares/authMiddleware";
import DecisionRepository from "../../repositories/BigDecisions/DecisionRepository";
import { MyAuthRequest } from "../../utils/MyAuthRequest";

const decisionRoute = Router();
const decisionRepo = getCustomRepository(DecisionRepository);

decisionRoute.delete(
  "/:id",
  authMiddleware,
  async (req: MyAuthRequest, res) => {}
);

export default decisionRoute;
