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
exports.scrapeLolRates = void 0;
const myConsoleError_1 = require("../myConsoleError");
const scrapeLolGraphs_1 = require("./scrapeLolRates/scrapeLolGraphs");
function scrapeLolRates() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // await scrapeChampions()
            // await scrapeOpgg()
            yield scrapeLolGraphs_1.scrapeLolGraphs();
        }
        catch (err) {
            myConsoleError_1.myConsoleError(err.message);
        }
    });
}
exports.scrapeLolRates = scrapeLolRates;
//# sourceMappingURL=scrapeLolRates.js.map