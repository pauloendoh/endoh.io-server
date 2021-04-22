"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLolGraphs = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
const myConsoleSuccess_1 = require("../../myConsoleSuccess");
function scrapeLolGraphs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            myConsoleSuccess_1.myConsoleSuccess("Starting scrapeLolGraphs");
            const browser = yield pup.launch({ ignoreDefaultArgs: true, });
            const page = yield browser.newPage();
            yield page.setViewport({
                width: 640,
                height: 480,
                deviceScaleFactor: 1,
            });
            yield page.goto('http://www.leagueofgraphs.com/champions/builds/by-winrate');
            yield page.screenshot({ path: __dirname + '/scrapeLolGraphs.png' });
            yield page.waitForSelector('.data_table.with_sortable_column tbody');
            page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
            const results = yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
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
                    yield delay(2000);
                    console.log(1);
                    const trs = document.querySelectorAll('.data_table.with_sortable_column tbody tr');
                    for (const tr of trs) {
                        if (tr.textContent.includes('KDA') || !tr.querySelector('.name'))
                            continue;
                        const tds = tr.querySelectorAll('td');
                        console.log(2);
                        const championName = tds[1].querySelector('.name').textContent.trim();
                        console.log(3);
                        const pickRate = tds[2].querySelector('.progressBarTxt').textContent;
                        console.log(4);
                        const winRate = tds[3].querySelector('.progressBarTxt').textContent;
                        results.push({ role, championName, pickRate, winRate });
                    }
                }
                return results;
            }));
            const saved = yield typeorm_1.getCustomRepository(LolRateRepository_1.default).saveLolGraphs(results);
            console.log(saved);
            myConsoleSuccess_1.myConsoleSuccess("Finished scrapeLolGraphs");
            yield browser.close();
        }
        catch (err) {
            myConsoleError_1.myConsoleError(err.message);
        }
    });
}
exports.scrapeLolGraphs = scrapeLolGraphs;
//# sourceMappingURL=scrapeLolGraphs.js.map