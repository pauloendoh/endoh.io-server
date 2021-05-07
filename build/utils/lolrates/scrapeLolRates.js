"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLolRates = void 0;
const pup = require("puppeteer");
const myConsoleError_1 = require("../myConsoleError");
const scrapeChampions_1 = require("./scrapeLolRates/scrapeChampions");
const scrapeOpgg_1 = require("./scrapeLolRates/scrapeOpgg");
const scrapeLolGraphs_1 = require("./scrapeLolRates/scrapeLolGraphs");
const scrapeUgg_1 = require("./scrapeLolRates/scrapeUgg");
async function scrapeLolRates() {
    const browser = await pup.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        await page.setViewport({ width: 1000, height: 1000 });
        await scrapeChampions_1.scrapeChampions(page);
        await scrapeOpgg_1.scrapeOpgg(page);
        await scrapeLolGraphs_1.scrapeLolGraphs(page);
        await scrapeUgg_1.scrapeUgg(page);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
    }
    await browser.close();
}
exports.scrapeLolRates = scrapeLolRates;
