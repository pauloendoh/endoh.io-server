type ConsoleLogParams = Parameters<typeof console.log>

export function myConsoleSuccess(...params: ConsoleLogParams) {
  // get hh:mm:ss with applied timezone
  const timeOffset = new Date().getTimezoneOffset() * 60 * 1000

  const time = new Date().getTime() - timeOffset

  const date = new Date(time).toISOString().slice(11, 19)

  const pre = `✅ [${date}] `

  console.log(pre, ...params)

  return
}
