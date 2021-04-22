"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myConsoleSuccess = void 0;
const chalk = require("chalk");
function myConsoleSuccess(text) {
    if (typeof text === 'string') {
        console.log(chalk.greenBright(text));
    }
    else {
        console.log(chalk.greenBright(JSON.stringify(text)));
    }
    return;
}
exports.myConsoleSuccess = myConsoleSuccess;
