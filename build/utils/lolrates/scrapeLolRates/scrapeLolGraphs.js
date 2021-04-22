"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLolGraphs = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
const myConsoleSuccess_1 = require("../../myConsoleSuccess");
async function scrapeLolGraphs() {
    myConsoleSuccess_1.myConsoleSuccess("Starting scrapeLolGraphs");
    const browser = await pup.launch();
    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        await page.goto('http://www.leagueofgraphs.com/champions/builds/by-winrate');
        await page.screenshot({ path: __dirname + '/scrapeLolGraphs.png' });
        await page.waitForSelector('.data_table.with_sortable_column tbody');
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        const results = await page.evaluate(async () => {
            function delay(time) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, time);
                });
            }
            const roles = [
                {
                    dataFilterFixed: "roles=top",
                    role: "TOP"
                },
                {
                    dataFilterFixed: "roles=jungle",
                    role: "JUNGLE"
                },
                {
                    dataFilterFixed: "roles=middle",
                    role: "MID"
                },
                {
                    dataFilterFixed: "roles=adc",
                    role: "BOT"
                },
                {
                    dataFilterFixed: "roles=support",
                    role: "SUP"
                }
            ];
            const results = [];
            for (const { dataFilterFixed, role } of roles) {
                const roleButton = document.querySelector(`[data-filters-fixed="${dataFilterFixed}"]`);
                roleButton.click();
                await delay(2000);
                // console.log(1)
                const trs = Array.from(document.querySelectorAll('.data_table.with_sortable_column tbody tr'));
                for (const tr of trs) {
                    if (tr.textContent.includes('KDA') || !tr.querySelector('.name'))
                        continue;
                    const tds = tr.querySelectorAll('td');
                    // console.log(2)
                    const championName = tds[1].querySelector('.name').textContent.trim();
                    // console.log(3)
                    const pickRate = tds[2].querySelector('.progressBarTxt').textContent;
                    // console.log(4)
                    const winRate = tds[3].querySelector('.progressBarTxt').textContent;
                    results.push({ role, championName, pickRate, winRate });
                }
            }
            return results;
        });
        const saved = await typeorm_1.getCustomRepository(LolRateRepository_1.default).saveLolGraphs(results);
        myConsoleSuccess_1.myConsoleSuccess("Finished scrapeLolGraphs");
        await browser.close();
    }
    catch (err) {
        await browser.close();
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeLolGraphs = scrapeLolGraphs;
//# sourceMappingURL=scrapeLolGraphs.js.map