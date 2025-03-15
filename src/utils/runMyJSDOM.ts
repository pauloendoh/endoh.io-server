import { JSDOM, VirtualConsole } from "jsdom"
import { myConsoleError } from "./myConsoleError"

export function myJSDOMDocument(html: string) {
  try {
    const virtualConsole = new VirtualConsole()
    virtualConsole.on("error", () => {
      myConsoleError("JSDOM error")
    })
    const dom = new JSDOM(html, {
      virtualConsole,
    })

    return dom.window.document
  } catch (err) {
    myConsoleError("Error parsing html. Stack: " + err.stack)
    return null
  }
}
