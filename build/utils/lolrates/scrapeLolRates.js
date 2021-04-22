"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLolRates = void 0;
const myConsoleError_1 = require("../myConsoleError");
const scrapeChampions_1 = require("./scrapeLolRates/scrapeChampions");
const scrapeOpgg_1 = require("./scrapeLolRates/scrapeOpgg");
const scrapeLolGraphs_1 = require("./scrapeLolRates/scrapeLolGraphs");
async function scrapeLolRates() {
    try {
        await scrapeChampions_1.scrapeChampions();
        await scrapeOpgg_1.scrapeOpgg();
        await scrapeLolGraphs_1.scrapeLolGraphs();
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
}
exports.scrapeLolRates = scrapeLolRates;
