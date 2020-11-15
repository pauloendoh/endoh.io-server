import * as chalk from 'chalk'

export function myConsoleError(text: any) {
    if (typeof text === 'string') {
        console.log(chalk.redBright(text))
    } else {
        console.log(chalk.redBright(JSON.stringify(text)))
    }
    return
}
