import { JSDOM } from "jsdom"
import { myConsoleError } from "./myConsoleError"

export function myJSDOMDocument(html: string) {
  try {
    const dom = new JSDOM(html)

    dom.virtualConsole.on("error", () => {
      myConsoleError("JSDOM error")
    })

    return dom.window.document
  } catch (err) {
    myConsoleError("Error parsing html. Stack: " + err.stack)
    return null
  }
}
