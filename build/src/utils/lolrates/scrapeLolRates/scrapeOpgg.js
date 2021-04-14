"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeOpgg = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
async function scrapeOpgg() {
    try {
        const browser = await pup.launch();
        const page = await browser.newPage();
        await page.goto('https://www.op.gg/champion/statistics');
        await page.waitForSelector('[data-tab-show-class="champion-trend-winratio"]');
        const results = await page.evaluate(() => {
            function getRoleByTBodyIndex(index) {
                switch (index) {
                    case 0: return 'TOP';
                    case 1: return 'JUNGLE';
                    case 2: return 'MID';
                    case 3: return 'BOT';
                    case 4: return 'SUP';
                }
            }
            const results = [];
            const tbodies = document.querySelectorAll('tbody');
            let tbodyIndex = 0;
            for (const tbody of tbodies) {
                const trs = tbody.querySelectorAll('tr');
                for (const tr of trs) {
                    const tds = tr.querySelectorAll('td');
                    const championTd = tds[3];
                    const championName = championTd.querySelector('.champion-index-table__name').textContent;
                    const winRate = tds[4].innerText;
                    const pickRate = tds[5].innerText;
                    results.push({
                        role: getRoleByTBodyIndex(tbodyIndex),
                        championName,
                        winRate, pickRate
                    });
                }
                tbodyIndex++;
            }
            return results;
        });
        const saved = await typeorm_1.getCustomRepository(LolRateRepository_1.default).saveOpgg(results);
        console.log(saved);
        await browser.close();
        return;
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeOpgg = scrapeOpgg;
//# sourceMappingURL=scrapeOpgg.js.map