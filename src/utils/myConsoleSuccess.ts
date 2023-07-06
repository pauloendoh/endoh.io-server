export function myConsoleSuccess(text: any) {
  // get hh:mm:ss with applied timezone
  const timeOffset = new Date().getTimezoneOffset() * 60 * 1000

  const time = new Date().getTime() - timeOffset

  const date = new Date(time).toISOString().slice(11, 19)

  const pre = `✅ [${date}] `

  if (typeof text === "string") {
    console.log(pre + text)
  } else {
    console.log(pre + JSON.stringify(text))
  }
  return
}
