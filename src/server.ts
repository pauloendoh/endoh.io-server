import * as cors from "cors";
import * as express from "express";
import autoroutes from "express-automatic-routes";
import * as fs from "fs";
import { createServer } from "http";
import { memoryUsage } from "process";
import * as Redis from "redis";
// Why did I import this for?
import "reflect-metadata";
import { Server } from "socket.io";
import { createConnection } from "typeorm";
import { pagination } from "typeorm-pagination";
import { PASSPORT_KEYS } from "./consts/PASSPORT_KEYS";
import executeEvery15Min from "./routines/executeEvery15Min";
import executeEveryHour from "./routines/executeEveryHour";
import { myConsoleError } from "./utils/myConsoleError";
import { myConsoleSuccess } from "./utils/myConsoleSuccess";
import { createPreferencesForAll } from "./utils/user/createPreferencesForAll";
import { createProfileForUsers } from "./utils/user/createProfileForAll";
import cookieSession = require("cookie-session");
import cookieParser = require("cookie-parser"); // parse cookie header
import passport = require("passport");
import bodyParser = require("body-parser");
require("./utils/passport-setup");
require(`dotenv`).config();
const env = process.env;
// It must use 'require' to work properly.
const ormconfig = require("../ormconfig");

const redisClient = Redis.createClient();

const DEFAULT_EXPIRATION = 3600;

// PE 2/3
myConsoleSuccess("Connecting with ormconfig");
createConnection(ormconfig)
  .then(async (connection) => {
    // await redisClient.connect();
    myConsoleSuccess("Connected!");
    const app = express();
    app.use(cors());

    app.use(pagination);

    app.use(
      "/auth/google/login",
      cors({ credentials: true, origin: process.env.CLIENT_BASE_URL })
    );

    // For testing
    app.get("/", async (req, res) => {
      res.statusMessage = "lmao";

      res.status(404).json("nice?");
    });

    app.get("/redis", async (req, res) => {
      redisClient
        .get("photos")
        .then((photos) => {
          if (photos) {
            console.log("CACHE HIT");
            return res.json(JSON.parse(photos));
          } else {
            console.log("CACHE MISS");
            redisClient.setEx(
              "photos",
              DEFAULT_EXPIRATION,
              JSON.stringify([
                { id: 1, name: "photo1" },
                { id: 2, name: "photo2" },
              ])
            );
            return res.status(200).json("nice?");
          }
        })
        .catch((err) => console.error(err.message));
    });

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(express.json({ limit: "50mb" }));

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
    // https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    // passport https://gist.githubusercontent.com/leannezhang/8069d56a779f2b86da40dfd17c9e3efe/raw/d896c190174c8494e34592c9b1000fc058172d1d/index.js
    app.use(
      cookieSession({
        name: "endoh_google_session",
        keys: [PASSPORT_KEYS.COOKIE_KEY],

        maxAge: 15 * 60 * 1000, // 15 min
      })
    );
    app.use(cookieParser());
    // initialize passport
    app.use(passport.initialize());

    // deserialize cookie from the browser and adds to req.user
    app.use(passport.session());

    // Automatically connect with /routes folder and subfolders
    myConsoleSuccess("Memory usage: " + memoryUsage().rss / 1024 / 1024 + "MB");
    myConsoleSuccess("Setting up routes");
    fs.readdirSync(`${__dirname}/routes`).forEach(async (fileOrFolderName) => {
      if (
        fileOrFolderName.endsWith(".ts") ||
        fileOrFolderName.endsWith(".js")
      ) {
        const routeName = fileOrFolderName.split("Route")[0];
        const module = await import(`${__dirname}/routes/${fileOrFolderName}`);
        app.use(`/${routeName}`, module.default);
      } else {
        // subroutes from subfolders
        fs.readdirSync(`${__dirname}/routes/${fileOrFolderName}`).forEach(
          async (fileName) => {
            const routeName = fileName.split("Route")[0];
            const module = await import(
              `${__dirname}/routes/${fileOrFolderName}/${fileName}`
            );
            app.use(`/${fileOrFolderName}/${routeName}`, module.default);
          }
        );
      }
    });

    // AUTO ROUTES
    autoroutes(app, { dir: "./auto-routes" });

    const port = process.env.PORT || 3000;
    myConsoleSuccess("Trying to access port " + port);

    app.listen(port, async () => {
      myConsoleSuccess("Listening to port " + port);

      createPreferencesForAll();
      createProfileForUsers();

      executeEvery15Min();
      executeEveryHour();
    });

    // SOCKET.IO
    const server = createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("a user has connected");

      socket.on("message", (data) => {
        console.log({ data });
        io.emit("message", data);
        // socket.broadcast.emit("message", data);
      });
    });

    server.listen(3001, () => {
      console.log("listening on *:3001");
    });
  })
  .catch((error) => myConsoleError(error));
