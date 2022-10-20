import pup from "puppeteer";
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository";
import { RoleTypes } from "../../../types/domain/lolates/RoleTypes";
import { myConsoleError } from "../../myConsoleError";
import { myConsoleSuccess } from "../../myConsoleSuccess";
import { IOpggResult } from "./scrapeOpgg";

export async function scrapeLolGraphs(page: pup.Page) {
  try {
    myConsoleSuccess("Starting scrapeLolGraphs");

    await page.goto(
      "http://www.leagueofgraphs.com/champions/builds/by-winrate"
    );

    await page.waitForSelector(".data_table.with_sortable_column tbody");

    const results = await page.evaluate(async () => {
      function delay(time) {
        return new Promise(function (resolve) {
          setTimeout(resolve, time);
        });
      }

      const roles: { dataFilterFixed: string; role: RoleTypes }[] = [
        {
          dataFilterFixed: "roles=top",
          role: "TOP",
        },
        {
          dataFilterFixed: "roles=jungle",
          role: "JUNGLE",
        },
        {
          dataFilterFixed: "roles=middle",
          role: "MID",
        },
        {
          dataFilterFixed: "roles=adc",
          role: "BOT",
        },
        {
          dataFilterFixed: "roles=support",
          role: "SUP",
        },
      ];

      const results: IOpggResult[] = [];

      for (const { dataFilterFixed, role } of roles) {
        const roleButton = document.querySelector(
          `[data-filters-fixed="${dataFilterFixed}"]`
        ) as HTMLElement;

        roleButton.click();
        await delay(2000);

        const trs = Array.from(
          document.querySelectorAll(".data_table.with_sortable_column tbody tr")
        );
        for (const tr of trs) {
          if (tr.textContent.includes("KDA") || !tr.querySelector(".name"))
            continue;

          const tds = tr.querySelectorAll("td");
          const championName = tds[1].querySelector(".name").textContent.trim();
          const pickRate = tds[2].querySelector(".progressBarTxt").textContent;
          const winRate = tds[3].querySelector(".progressBarTxt").textContent;

          results.push({ role, championName, pickRate, winRate });
        }
      }

      return results;
    });

    await LolRateRepository.saveLolGraphs(results);

    myConsoleSuccess("Finished scrapeLolGraphs");
  } catch (err) {
    myConsoleError(err.message);
  }
}
