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
exports.scrapeChampions = void 0;
const pup = require("puppeteer");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../../../repositories/LolRateRepository");
const myConsoleError_1 = require("../../myConsoleError");
function scrapeChampions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield pup.launch();
            const page = yield browser.newPage();
            yield page.goto('https://blitz.gg/lol/champions/overview');
            yield page.waitForSelector('.champion-name-container');
            const champions = yield page.evaluate(() => {
                const champions = [];
                const containers = document.querySelectorAll('.champion-name-container');
                for (const container of containers) {
                    const iconUrl = container.querySelector('img').getAttribute('src');
                    const name = container.querySelector('span').textContent;
                    champions.push({ name, iconUrl });
                }
                return champions;
            });
            const saved = yield typeorm_1.getCustomRepository(LolRateRepository_1.default)
                .saveChampions(champions);
            yield browser.close();
            return saved;
        }
        catch (err) {
            myConsoleError_1.myConsoleError(err.message);
        }
    });
}
exports.scrapeChampions = scrapeChampions;
//# sourceMappingURL=scrapeChampions.js.map