// Why did I import this for?
import "reflect-metadata";
import { getResourceRepository } from "../repositories/relearn/ResourceRepository";
import { scrapeLolRates } from "../utils/lolrates/scrapeLolRates";
import { createUserSuggestionsForAll } from "../utils/user/createUserSuggestionsForAll/createUserSuggestionsForAll";

const executeEveryHour = async () => {
  scrapeLolRates();
  createUserSuggestionsForAll();
  getResourceRepository().resetRatingsWhereCompletedAtIsNull();

  setInterval(async () => {
    scrapeLolRates();
    createUserSuggestionsForAll();
    getResourceRepository().resetRatingsWhereCompletedAtIsNull();
  }, 60 * 1000 * 60);
};

export default executeEveryHour;
