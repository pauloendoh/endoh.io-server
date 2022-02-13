import * as cors from "cors";
import * as express from "express";
import autoroutes from "express-automatic-routes";
import * as fs from "fs";
import { memoryUsage } from "process";
// Why did I import this for?
import "reflect-metadata";
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

// PE 2/3
myConsoleSuccess("Connecting with ormconfig");
createConnection(ormconfig)
  .then(async (connection) => {
    myConsoleSuccess("Connected!");
    const app = express();
    app.use(cors());

    app.use(pagination);

    app.use(
      "/auth/google/login",
      cors({ credentials: true, origin: process.env.CLIENT_BASE_URL })
    );

    // For testing
    app.get("/", (req, res) => {
      res.statusMessage = "lmao";

      res.status(404).json("nice?");
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
      if (fileOrFolderName.includes(".js.map")) return;
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
  })
  .catch((error) => myConsoleError(error));
