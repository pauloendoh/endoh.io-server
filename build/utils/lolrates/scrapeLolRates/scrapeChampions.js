"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeChampions = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
async function scrapeChampions() {
    try {
        const browser = await pup.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        await page.goto('https://blitz.gg/lol/champions/overview');
        await page.waitForSelector('.champion-name-container');
        const champions = await page.evaluate(() => {
            const champions = [];
            const containers = Array.from(document.querySelectorAll('.champion-name-container'));
            for (const container of containers) {
                const iconUrl = container.querySelector('img').getAttribute('src');
                const name = container.querySelector('span').textContent;
                champions.push({ name, iconUrl });
            }
            return champions;
        });
        const saved = await typeorm_1.getCustomRepository(LolRateRepository_1.default)
            .saveChampions(champions);
        await browser.close();
        return saved;
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeChampions = scrapeChampions;
//# sourceMappingURL=scrapeChampions.js.map