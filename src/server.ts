import * as cors from "cors"
import * as express from "express"
import * as fs from "fs"
import fetch from "node-fetch"
// Why did I import this for?
import "reflect-metadata"
import { createConnection, getCustomRepository } from "typeorm"
import { PASSPORT_KEYS } from "./consts/PASSPORT_KEYS"
import UserRepository from "./repositories/UserRepository"
import { myConsoleError } from "./utils/myConsoleError"
import { myConsoleSuccess } from "./utils/myConsoleSuccess"
import { createPreferencesForAll } from "./utils/user/createPreferencesForAll"
import cookieSession = require("cookie-session")
import cookieParser = require("cookie-parser") // parse cookie header
import passport = require("passport")
import { memoryUsage } from "process"
import { createProfileForUsers } from "./utils/user/createProfileForAll"
import { createUserSuggestionsForAll } from "./utils/user/createUserSuggestionsForAll/createUserSuggestionsForAll"
import { scrapeLolRates } from "./utils/lolrates/scrapeLolRates"
import bodyParser = require('body-parser')
require("./utils/passport-setup")
require(`dotenv`).config()

// It must use 'require' to work properly.
const ormconfig = require("../ormconfig")

// PE 2/3
myConsoleSuccess("Connecting with ormconfig")
createConnection(ormconfig)
  .then(async (connection) => {
    myConsoleSuccess("Connected!")
    const app = express()
    app.use(cors())
    app.use(
      "/auth/google/login",
      cors({ credentials: true, origin: process.env.CLIENT_BASE_URL })
    )

    // For testing
    app.get("/", (req, res) => res.json("nice?"))

     // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
     app.use(express.json({limit: '50mb'}))

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
    app.use(express.urlencoded({ limit: '50mb' }))

   

    // passport https://gist.githubusercontent.com/leannezhang/8069d56a779f2b86da40dfd17c9e3efe/raw/d896c190174c8494e34592c9b1000fc058172d1d/index.js
    app.use(
      cookieSession({
        name: "endoh_google_session",
        keys: [PASSPORT_KEYS.COOKIE_KEY],

        maxAge: 15 * 60 * 1000, // 15 min
      })
    )
    app.use(cookieParser())
    // initialize passport
    app.use(passport.initialize())

    // deserialize cookie from the browser and adds to req.user
    app.use(passport.session())

    // Automatically connect with /routes folder and subfolders
    myConsoleSuccess("Memory usage: " + memoryUsage().rss / 1024 / 1024 + "MB")
    myConsoleSuccess("Setting up routes")
    fs.readdirSync(`${__dirname}/routes`).forEach(async (fileOrFolderName) => {
      if (
        fileOrFolderName.endsWith(".ts") ||
        fileOrFolderName.endsWith(".js")
      ) {
        const routeName = fileOrFolderName.split("Route")[0]
        const module = await import(`${__dirname}/routes/${fileOrFolderName}`)
        app.use(`/${routeName}`, module.default)
      } else {
        // subroutes from subfolders
        fs.readdirSync(`${__dirname}/routes/${fileOrFolderName}`).forEach(
          async (fileName) => {
            const routeName = fileName.split("Route")[0]
            const module = await import(
              `${__dirname}/routes/${fileOrFolderName}/${fileName}`
            )
            app.use(`/${fileOrFolderName}/${routeName}`, module.default)
          }
        )
      }
    })

    const port = process.env.PORT || 3000
    myConsoleSuccess("Trying to access port " + port)

    app.listen(port, async () => {
      myConsoleSuccess("Listening to port " + port)

      // scrape lolrates every 1h
      scrapeLolRates()
      setInterval(async () => {
        scrapeLolRates()
      }, 60 * 1000 * 60)

      myConsoleSuccess(
        "Pinging every 15 min at https://endohio-server.herokuapp.com/"
      )

      createPreferencesForAll()
      createProfileForUsers()

      createUserSuggestionsForAll()
      // renovar sugestões de usuários a cada 1h
      setInterval(async () => {
        createUserSuggestionsForAll()
      }, 60 * 1000 * 60)

      // Ping every15 min to avoid Heroku's server sleep
      // Maybe split into different file?
      setInterval(async () => {
        fetch("https://endohio-server.herokuapp.com/")
          .then((res) => res.json())
          .then((json) =>
            myConsoleSuccess("GET OK https://endohio-server.herokuapp.com/")
          )

        try {
          const userRepo = getCustomRepository(UserRepository)

          const deleted = await userRepo.deleteExpiredTempUsers()
          myConsoleSuccess("Deleting expired temp users")
        } catch (e) {
          myConsoleError(e.message)
        }
      }, 60 * 1000 * 15)
    })
  })
  .catch((error) => myConsoleError(error))
