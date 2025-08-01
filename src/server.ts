import yaml from "yaml"

import swaggerUi from "swagger-ui-express"

import { generateOpenApi } from "@ts-rest/open-api"

import { createExpressEndpoints, initServer } from "@ts-rest/express"

import express, { Request, Response } from "express"
import { createServer } from "http"
import { memoryUsage } from "process"

// Why did I import this for?
import { ApolloServer } from "apollo-server-express"
import "reflect-metadata"
import { Server } from "socket.io"

import bodyParser from "body-parser"
import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers"
import { buildSchema } from "type-graphql"
import { PASSPORT_KEYS } from "./consts/PASSPORT_KEYS"
import { dataSource } from "./dataSource"
import { controllers, mainContract } from "./domains/mainContract"
import saveResponseTime from "./middlewares/saveResponseTime"
import { LearningResolver } from "./resolvers/learning-diary/LearningResolver"
import { ResourceResolver } from "./resolvers/ResourceResolver"
import { SkillProgressResolver } from "./resolvers/skillbase/SkillProgress/SkillProgressResolver"
import { LinkPreviewResolver } from "./resolvers/utils/LinkPreview/LinkPreviewResolver"
import executeEvery15Min from "./routines/executeEvery15Min"
import executeEvery3Min from "./routines/executeEvery3Min"
import executeEveryHour from "./routines/executeEveryHour"
import { executeOnStart } from "./routines/executeOnStart/executeOnStart"
import { myConsoleInfo } from "./utils/console/myConsoleInfo"
import { myConsoleLoading } from "./utils/console/myConsoleLoading"
import { validateJwt } from "./utils/domain/auth/validateJwt"
import { myConsoleError } from "./utils/myConsoleError"
import { myConsoleSuccess } from "./utils/myConsoleSuccess"
import { createPreferencesForAll } from "./utils/user/createPreferencesForAll"
import { createProfileForUsers } from "./utils/user/createProfileForAll"
import cookieSession = require("cookie-session")
import cookieParser = require("cookie-parser") // parse cookie header
import passport = require("passport")

import path = require("path")
import compression = require("compression")
const partialResponse = require("express-partial-response")
require("./utils/passport-setup")
require(`dotenv`).config()

dataSource
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
    const routingControllersOptions: RoutingControllersOptions = {
      cors: true,
      controllers: [path.join(__dirname + "/**/*Controller{.js,.ts}")],
      currentUserChecker: async (action: Action) => {
        const token = action.request.headers["x-auth-token"]
        const user = await validateJwt(token)
        return user
      },
    }

    const app = createExpressServer(
      routingControllersOptions
    ) as express.Application

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    const s = initServer()

    const router = s.router(mainContract, controllers)

    createExpressEndpoints(mainContract, router, app)

    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [
            LearningResolver,
            LinkPreviewResolver,
            SkillProgressResolver,
            ResourceResolver,
          ],
        }),
        csrfPrevention: true,
        context: ({ req, res }) => ({ req, res }),
      })

      await apolloServer.start()
      apolloServer.applyMiddleware({ app: app as any, path: "/graphql" })
      myConsoleSuccess("Apollo server started")
    } catch (e: any) {
      myConsoleError(e.message)
    }

    app.use(partialResponse())
    app.use(saveResponseTime())
    app.use(
      compression({
        level: 6,
        threshold: 100 * 1000, // 100kB
      })
    )

    // For testing
    app.get("/", async (_: Request, res: Response) => {
      res.statusMessage = "zimbabwe"
      res.status(200).json({
        message: "nice",
        data: [
          {
            id: 1,
            cat: {
              favoriteFoods: [
                {
                  name: "pizza",
                  calories: 1000,
                },
                {
                  name: "burger",
                  calories: 1000,
                },
              ],
            },
          },
          { id: 2, cat: "xd" },
        ],
      })
    })

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(express.json({ limit: "50mb" }))

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
    // https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
    app.use(express.urlencoded({ limit: "50mb", extended: true }))

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

    app.use(express.static("public"))

    const swaggerDocument = generateOpenApi(
      mainContract,
      {
        info: {
          title: "My API",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
      {
        setOperationId: true,
        operationMapper: (operation, appRoute) => ({
          ...operation,
          // ...(hasCustomTags(appRoute.metadata)
          //   ? {
          //       tags: appRoute.metadata.openApiTags,
          //     }
          //   : {}),
          // ...(hasSecurity(appRoute.metadata)
          //   ? {
          //       security: appRoute.metadata.openApiSecurity,
          //     }
          //   : {}),
        }),
      }
    )

    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    app.get("/swagger.yaml", (req, res) => {
      res.setHeader("Content-Type", "text/yaml")
      res.send(yaml.stringify(swaggerDocument))
    })

    // Automatically connect with /routes folder and subfolders
    myConsoleInfo("Memory usage: " + memoryUsage().rss / 1024 / 1024 + "MB")
    myConsoleLoading("Setting up routes")

    const port = process.env.PORT ?? 3000
    myConsoleLoading("Trying to access port " + port)

    app.listen(port, async () => {
      myConsoleSuccess("Listening to port " + port)

      createPreferencesForAll()
      createProfileForUsers()

      executeOnStart()
      executeEvery3Min()
      executeEvery15Min()
      executeEveryHour()

      // loop
    })

    // SOCKET.IO
    const socketServer = createServer(app)

    const io = new Server(socketServer, {
      cors: {
        origin: "*",
      },
    })

    io.on("connection", (socket) => {
      myConsoleSuccess("a user has connected")

      socket.on("message", (data) => {
        io.emit("message", data)
        // socket.broadcast.emit("message", data);
      })
    })

    socketServer.listen(3001, () => {
      myConsoleSuccess("listening on *:3001")
    })
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })
