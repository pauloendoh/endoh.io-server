// Why did I import this for?
import "reflect-metadata";
import { getResourceRepository } from "../../repositories/relearn/ResourceRepository";
import { scrapeLolRates } from "../../utils/lolrates/scrapeLolRates";
import { createUserSuggestionsForAll } from "../../utils/user/createUserSuggestionsForAll/createUserSuggestionsForAll";
import saveSkillHistoryFromAllUsers from "./saveSkillHistoryFromAllUsers/saveSkillHistoryFromAllUsers";

const executeEveryHour = async () => {
  scrapeLolRates();
  createUserSuggestionsForAll();
  getResourceRepository().resetRatingsWhereCompletedAtIsNull();
  saveSkillHistoryFromAllUsers();

  setInterval(async () => {
    scrapeLolRates().catch((e) => console.error("Error scraping lolrates"));
    createUserSuggestionsForAll();
    getResourceRepository().resetRatingsWhereCompletedAtIsNull();
  }, 60 * 1000 * 60);
};

export default executeEveryHour;
