"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLolRates = void 0;
const myConsoleError_1 = require("../myConsoleError");
const scrapeLolGraphs_1 = require("./scrapeLolRates/scrapeLolGraphs");
async function scrapeLolRates() {
    try {
        // await scrapeChampions()
        // await scrapeOpgg()
        await scrapeLolGraphs_1.scrapeLolGraphs();
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeLolRates = scrapeLolRates;
//# sourceMappingURL=scrapeLolRates.js.map