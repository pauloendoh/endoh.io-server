import * as dotenv from "dotenv";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { EmailPostDto } from "../interfaces/dtos/auth/EmailPostDto";
import authMiddleware from "../middlewares/authMiddleware";
import NotificationRepository from "../repositories/feed/NotificationRepository";
import UserRepository from "../repositories/UserRepository";
import { isValidEmail } from "../utils/email/isValidEmail";
import { sendPasswordResetEmail } from "../utils/email/sendPasswordResetEmail";
import { MyErrorsResponse } from "../utils/ErrorMessage";
import { MyAuthRequest } from "../utils/MyAuthRequest";
import { myConsoleError } from "../utils/myConsoleError";

dotenv.config();

const utilsRoute = Router();
const userRepo = getCustomRepository(UserRepository);

utilsRoute.post("/passwordResetEmail", async (req, res) => {
  try {
    const { email } = req.body as EmailPostDto;
    if (!isValidEmail(email)) {
      return res
        .sendStatus(400)
        .json(new MyErrorsResponse("This is not an email lol"));
    }

    const registeredUser = await userRepo.findOne({ email });
    if (!registeredUser) {
      return res.sendStatus(200);
    }

    // sending email
    sendPasswordResetEmail(registeredUser);
    return res.sendStatus(200);
  } catch (err) {
    myConsoleError(err.message);
    return res.sendStatus(400).json(new MyErrorsResponse(err.message));
  }
});

utilsRoute.get(
  "/notifications",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    const repo = getCustomRepository(NotificationRepository);

    try {
      const notifications = await repo.getNotifications(req.user.id);
      return res.status(200).json(notifications);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

utilsRoute.post(
  "/notifications/seeAll",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    const notRepo = getCustomRepository(NotificationRepository);

    try {
      await notRepo
        .createQueryBuilder()
        .update()
        .set({ seen: true })
        .where("userId = :userId", { userId: req.user.id })
        .execute();

      const notifications = await notRepo.getNotifications(req.user.id);

      return res.status(200).json(notifications);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

export default utilsRoute;
