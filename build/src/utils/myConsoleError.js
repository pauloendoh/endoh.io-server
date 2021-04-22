"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myConsoleError = void 0;
const chalk = require("chalk");
function myConsoleError(text) {
    if (typeof text === 'string') {
        console.log(chalk.redBright(text));
    }
    else {
        console.log(chalk.redBright(JSON.stringify(text)));
    }
    return;
}
exports.myConsoleError = myConsoleError;
//# sourceMappingURL=myConsoleError.js.map