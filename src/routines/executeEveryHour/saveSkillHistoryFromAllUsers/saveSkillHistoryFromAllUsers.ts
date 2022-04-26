import { getCustomRepository } from "typeorm";
import UserRepository from "../../../repositories/UserRepository";
import SkillHistoryService from "../../../services/SkillHistoryService";
import { myConsoleSuccess } from "../../../utils/myConsoleSuccess";

const saveSkillHistoryFromAllUsers = async (
  userRepo = getCustomRepository(UserRepository),
  historyService = new SkillHistoryService()
) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const users = await userRepo.find();

  for (const { id: userId } of users) {
    const thisMonthHistories = await historyService.findFromMonth({
      userId,
      year,
      month,
    });

    const alreadySavedThisMonth = thisMonthHistories.length > 0;
    if (alreadySavedThisMonth) return;

    await historyService.saveCurrentSkillHistory(userId);
  }

  myConsoleSuccess("Saved skill histories from all users.");
};

export default saveSkillHistoryFromAllUsers;
