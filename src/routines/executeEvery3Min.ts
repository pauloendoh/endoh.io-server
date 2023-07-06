// Why did I import this for?
import axios from "axios"
import "reflect-metadata"
import { myConsoleSuccess } from "../utils/myConsoleSuccess"

const executeEvery3Min = async () => {
  setInterval(async () => {
    const ideameter = "https://ideameter.vercel.app/group/123"
    axios(ideameter)
      .then((res) => myConsoleSuccess("GET OK " + ideameter))
      .catch(() => {
        myConsoleSuccess("GET FAIL BUT OK " + ideameter)
      })
  }, 60 * 1000 * 2.5)
}

export default executeEvery3Min
