import { Page } from "puppeteer";
import { getCustomRepository } from "typeorm";
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository";
import { RoleTypes } from "../../../types/domain/lolates/RoleTypes";
import { myConsoleError } from "../../myConsoleError";
import { myConsoleSuccess } from "../../myConsoleSuccess";
import { sleep } from "../../sleep";

export interface IOpggResult {
  role: string;
  championName: string;
  winRate: string;
  pickRate: string;
}

export async function scrapeOpgg(page: Page) {
  myConsoleSuccess("Starting scrapeOpgg");
  try {
    const positions: string[] = ["top", "jungle", "mid", "adc", "support"];

    let allRolesResults: IOpggResult[] = [];

    for (const position of positions) {
      await page.goto(`https://www.op.gg/champions?position=${position}`);

      await page.waitForSelector("tbody");
      await sleep(500); // waiting for champions sort

      allRolesResults = allRolesResults.concat(
        await page.evaluate(() => {
          function getRole(): RoleTypes {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());

            switch (params.position) {
              case "top":
                return "TOP";
              case "jungle":
                return "JUNGLE";
              case "mid":
                return "MID";
              case "adc":
                return "BOT";
              case "support":
                return "SUP";
              default:
                return "TOP";
            }
          }

          const roleResults: IOpggResult[] = [];
          const tbody = document.querySelector("tbody");
          const trs = Array.from(tbody.querySelectorAll("tr"));
          console.log({ tbody });
          debugger;

          for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            const championTd = tds[1];
            const championName = championTd.querySelector("strong").textContent;
            const winRate = tds[2].innerText;
            const pickRate = tds[3].innerText;

            roleResults.push({
              role: getRole(),
              championName,
              winRate,
              pickRate,
            });
          }

          return roleResults;
        })
      );
    }

    const saved = await getCustomRepository(LolRateRepository).saveOpgg(
      allRolesResults
    );
    myConsoleSuccess(`OP GG OK: ${allRolesResults.length} results`);

    return;
  } catch (err) {
    myConsoleError(err.message);
  }
}
