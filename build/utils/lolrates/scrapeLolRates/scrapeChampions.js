"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeChampions = void 0;
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
async function scrapeChampions(page) {
    try {
        await page.goto("https://blitz.gg/lol/champions/overview");
        await page.screenshot({ path: __dirname + "/scrapeChampions.png" });
        await page.waitForSelector(".champion-name-container");
        const champions = await page.evaluate(() => {
            const champions = [];
            const containers = Array.from(document.querySelectorAll(".champion-name-container"));
            for (const container of containers) {
                const iconUrl = container.querySelector("img").getAttribute("src");
                const name = container.querySelector("span").textContent;
                champions.push({ name, iconUrl });
            }
            return champions;
        });
        const saved = await typeorm_1.getCustomRepository(LolRateRepository_1.default).saveChampions(champions);
        return saved;
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeChampions = scrapeChampions;
