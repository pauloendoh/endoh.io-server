// Why did I import this for?
import axios from "axios"
import "reflect-metadata"
import UserRepository from "../repositories/UserRepository"
import { myConsoleLoading } from "../utils/console/myConsoleLoading"
import { myConsoleError } from "../utils/myConsoleError"
import { myConsoleSuccess } from "../utils/myConsoleSuccess"

const executeEvery15Min = async () => {
  setInterval(async () => {
    axios("https://endohio-server.herokuapp.com/")
      .then((res) =>
        myConsoleSuccess("GET OK https://endohio-server.herokuapp.com/")
      )
      .catch(() => {
        myConsoleError("GET FAIL https://endohio-server.herokuapp.com/")
      })

    axios("https://ration-server.herokuapp.com/ping")
      .then((res) =>
        myConsoleSuccess("GET OK https://ration-server.herokuapp.com/ping")
      )
      .catch(() => {
        myConsoleError("GET FAIL https://ration-server.herokuapp.com/ping")
      })

    axios("https://monerate-server.herokuapp.com/ping")
      .then((res) =>
        myConsoleSuccess("GET OK https://monerate-server.herokuapp.com/ping")
      )
      .catch(() => {
        myConsoleSuccess("GET OK? https://monerate-server.herokuapp.com/ping")
      })

    axios("https://clothes-server.onrender.com/ping")
      .then((res) =>
        myConsoleSuccess("GET OK https://clothes-server.onrender.com/ping")
      )
      .catch((err) => {
        myConsoleError("GET FAIL https://clothes-server.onrender.com/ping")
      })

    axios("https://lolrates.vercel.app/")
      .then((res) => myConsoleSuccess("GET OK https://lolrates.vercel.app/"))
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
