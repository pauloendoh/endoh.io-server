import fetch from "node-fetch"
// Why did I import this for?
import "reflect-metadata"
import { myConsoleSuccess } from "../utils/myConsoleSuccess"

const executeEvery3Min = async () => {
  setInterval(async () => {
    const ideameter = "https://ideameter.vercel.app/group/123"
    fetch(ideameter)
      .then((res) => res.json())
      .then((json) => myConsoleSuccess("GET OK " + ideameter))
      .catch(() => {
        myConsoleSuccess("GET FAIL BUT OK " + ideameter)
      })
  }, 60 * 1000 * 3)
}

export default executeEvery3Min
