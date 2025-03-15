import { JSDOM } from "jsdom"
import { myConsoleError } from "./myConsoleError"

export function myJSDOMDocument(html: string) {
  try {
    const dom = new JSDOM(html)

    return dom.window.document
  } catch (err) {
    myConsoleError("Error parsing html. Stack: " + err.stack)
    return null
  }
}
