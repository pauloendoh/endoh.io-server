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
exports.scrapeOpgg = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
function scrapeOpgg() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield pup.launch();
            const page = yield browser.newPage();
            yield page.goto('https://www.op.gg/champion/statistics');
            yield page.waitForSelector('[data-tab-show-class="champion-trend-winratio"]');
            const results = yield page.evaluate(() => {
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
            const saved = yield typeorm_1.getCustomRepository(LolRateRepository_1.default).saveOpgg(results);
            console.log(saved);
            yield browser.close();
            return;
        }
        catch (err) {
            myConsoleError_1.myConsoleError(err.message);
        }
    });
}
exports.scrapeOpgg = scrapeOpgg;
//# sourceMappingURL=scrapeOpgg.js.map