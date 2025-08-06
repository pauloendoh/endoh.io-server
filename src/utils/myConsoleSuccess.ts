type ConsoleLogParams = Parameters<typeof console.log>

export function myConsoleSuccess(...params: ConsoleLogParams) {
  const prefix = `✅`

  console.log(prefix, ...params)

  return
}
