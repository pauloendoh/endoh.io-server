import express from "express"
import { createServer } from "http"
import { memoryUsage } from "process"

// Why did I import this for?
import { ApolloServer } from "apollo-server-express"
import "reflect-metadata"
import { Server } from "socket.io"
import * as swaggerUi from "swagger-ui-express"

import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers"
import { Stripe } from "stripe"
import { buildSchema } from "type-graphql"
import { pagination } from "typeorm-pagination"
import { PASSPORT_KEYS } from "./consts/PASSPORT_KEYS"
import { dataSource } from "./dataSource"
import saveResponseTime from "./middlewares/saveResponseTime"
import executeEvery15Min from "./routines/executeEvery15Min"
import executeEvery3Min from "./routines/executeEvery3Min"
import executeEveryHour from "./routines/executeEveryHour"
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
import bodyParser = require("body-parser")
import responseTime = require("response-time")
import path = require("path")
import compression = require("compression")
const partialResponse = require("express-partial-response")
require("./utils/passport-setup")
require(`dotenv`).config()
const stripe: Stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

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

    const app = createExpressServer(routingControllersOptions)

    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [__dirname + "/resolvers/**/*Resolver.{ts,js}"],
        }),
        csrfPrevention: true,
        context: ({ req, res }) => ({ req, res }),
      })

      await apolloServer.start()
      apolloServer.applyMiddleware({ app, path: "/graphql" })
      myConsoleSuccess("Apollo server started")
    } catch (e) {
      myConsoleError(e.message)
    }

    // app.use(cors());

    app.use(partialResponse())
    app.use(saveResponseTime())
    app.use(
      compression({
        level: 6,
        threshold: 100 * 1000, // 100kB
      })
    )

    app.use(pagination)

    // For testing
    app.get("/", async (req, res) => {
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

    const storeItems = new Map([
      [1, { priceInCents: 10000, name: "Learn React Today" }],
      [2, { priceInCents: 20000, name: "Learn CSS Today" }],
    ])
    app.post("/create-checkout-session", async (req, res) => {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: req.body.items.map((item) => {
            const storeItem = storeItems.get(item.id)
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: storeItem.name,
                },
                unit_amount: storeItem.priceInCents,
              },
              quantity: item.quantity,
            }
          }),
          success_url: `${process.env.SERVER_BASE_URL}/success`,

          cancel_url: `${process.env.SERVER_BASE_URL}/cancel`,
        })
        res.json({ url: session.url })
      } catch (e) {
        res.status(500).json({ errors: e.message })
      }
    })

    // PE 1/3 - delete?..
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: "/swagger.json",
        },
      })
    )

    // Automatically connect with /routes folder and subfolders
    myConsoleInfo("Memory usage: " + memoryUsage().rss / 1024 / 1024 + "MB")
    myConsoleLoading("Setting up routes")

    const port = process.env.PORT || 3000
    myConsoleLoading("Trying to access port " + port)

    app.listen(port, async () => {
      myConsoleSuccess("Listening to port " + port)

      createPreferencesForAll()
      createProfileForUsers()

      executeEvery3Min()
      executeEvery15Min()
      executeEveryHour()
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
