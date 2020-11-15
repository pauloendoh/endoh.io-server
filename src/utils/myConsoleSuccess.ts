import * as chalk from 'chalk'

export function myConsoleSuccess(text: any) {
    if (typeof text === 'string') {
        console.log(chalk.greenBright(text))
    }
    else {
        console.log(chalk.greenBright(JSON.stringify(text)))

    }
    return
}
