import fetch from "node-fetch"
// Why did I import this for?
import "reflect-metadata"
import UserRepository from "../repositories/UserRepository"
import { myConsoleLoading } from "../utils/console/myConsoleLoading"
import { myConsoleError } from "../utils/myConsoleError"
import { myConsoleSuccess } from "../utils/myConsoleSuccess"

const executeEvery15Min = async () => {
  setInterval(async () => {
    fetch("https://endohio-server.herokuapp.com/")
      .then((res) => res.json())
      .then((json) =>
        myConsoleSuccess("GET OK https://endohio-server.herokuapp.com/")
      )
      .catch(() => {
        myConsoleError("GET FAIL https://endohio-server.herokuapp.com/")
      })

    fetch("https://clothes-server.onrender.com/ping")
      .then((res) =>
        myConsoleSuccess("GET OK https://clothes-server.onrender.com/ping")
      )
      .catch((err) => {
        myConsoleError("GET FAIL https://clothes-server.onrender.com/ping")
      })

    fetch("https://lolrates.vercel.app/")
      .then((res) => res.text())
      .then((text) => myConsoleSuccess("GET OK https://lolrates.vercel.app/"))
      .catch(() => myConsoleError("GET FAIL https://lolrates.vercel.app/"))

    try {
      const userRepo = UserRepository

      const deleted = await userRepo.deleteExpiredTempUsers()
      myConsoleLoading("Deleting expired temp users")
    } catch (e) {
      myConsoleError(e.message)
    }
  }, 60 * 1000 * 15)
}

export default executeEvery15Min
