import * as pup from "puppeteer";
import { getCustomRepository } from "typeorm";
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository";
import { myConsoleError } from "../../myConsoleError";

export interface IChampion {
  name: string;
  iconUrl: string;
}

export async function scrapeChampions(page: pup.Page) {
  try {
    await page.goto("https://blitz.gg/lol/champions/overview");

    await page.waitForSelector(".champion-name-container");

    const champions = await page.evaluate(() => {
      const champions: IChampion[] = [];
      const containers = Array.from(
        document.querySelectorAll(".champion-name-container")
      );

      for (const container of containers) {
        const iconUrl = container.querySelector("img").getAttribute("src");
        const name = container.querySelector("span").textContent;

        // 23/apr 2022 - it was returning fallback images
        // like https://blitz-cdn-plain.blitz.gg/blitz/ui/img/fallback.svg
        // and it was causing repeated champions
        if (iconUrl.includes("fallback")) continue;

        champions.push({ name, iconUrl });
      }

      return champions;
    });

    const saved = await getCustomRepository(LolRateRepository).saveChampions(
      champions
    );

    return saved;
  } catch (err) {
    myConsoleError(err.message);
  }
}
