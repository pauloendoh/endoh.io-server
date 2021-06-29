"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const node_fetch_1 = require("node-fetch");
// Why did I import this for?
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const PASSPORT_KEYS_1 = require("./consts/PASSPORT_KEYS");
const UserRepository_1 = require("./repositories/UserRepository");
const myConsoleError_1 = require("./utils/myConsoleError");
const myConsoleSuccess_1 = require("./utils/myConsoleSuccess");
const createPreferencesForAll_1 = require("./utils/user/createPreferencesForAll");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header
const passport = require("passport");
const process_1 = require("process");
const createProfileForAll_1 = require("./utils/user/createProfileForAll");
const createUserSuggestionsForAll_1 = require("./utils/user/createUserSuggestionsForAll/createUserSuggestionsForAll");
const scrapeLolRates_1 = require("./utils/lolrates/scrapeLolRates");
require("./utils/passport-setup");
require(`dotenv`).config();
// It must use 'require' to work properly.
const ormconfig = require("../ormconfig");
// PE 2/3
myConsoleSuccess_1.myConsoleSuccess("Connecting with ormconfig");
typeorm_1.createConnection(ormconfig)
    .then(async (connection) => {
    myConsoleSuccess_1.myConsoleSuccess("Connected!");
    const app = express();
    app.use(cors());
    app.use("/auth/google/login", cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
    // For testing
    app.get("/", (req, res) => res.json("nice?"));
    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(express.json({ limit: '50mb' }));
    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
    app.use(express.urlencoded({ limit: '50mb' }));
    // passport https://gist.githubusercontent.com/leannezhang/8069d56a779f2b86da40dfd17c9e3efe/raw/d896c190174c8494e34592c9b1000fc058172d1d/index.js
    app.use(cookieSession({
        name: "endoh_google_session",
        keys: [PASSPORT_KEYS_1.PASSPORT_KEYS.COOKIE_KEY],
        maxAge: 15 * 60 * 1000,
    }));
    app.use(cookieParser());
    // initialize passport
    app.use(passport.initialize());
    // deserialize cookie from the browser and adds to req.user
    app.use(passport.session());
    // Automatically connect with /routes folder and subfolders
    myConsoleSuccess_1.myConsoleSuccess("Memory usage: " + process_1.memoryUsage().rss / 1024 / 1024 + "MB");
    myConsoleSuccess_1.myConsoleSuccess("Setting up routes");
    fs.readdirSync(`${__dirname}/routes`).forEach(async (fileOrFolderName) => {
        if (fileOrFolderName.endsWith(".ts") ||
            fileOrFolderName.endsWith(".js")) {
            const routeName = fileOrFolderName.split("Route")[0];
            const module = await Promise.resolve().then(() => require(`${__dirname}/routes/${fileOrFolderName}`));
            app.use(`/${routeName}`, module.default);
        }
        else {
            // subroutes from subfolders
            fs.readdirSync(`${__dirname}/routes/${fileOrFolderName}`).forEach(async (fileName) => {
                const routeName = fileName.split("Route")[0];
                const module = await Promise.resolve().then(() => require(`${__dirname}/routes/${fileOrFolderName}/${fileName}`));
                app.use(`/${fileOrFolderName}/${routeName}`, module.default);
            });
        }
    });
    const port = process.env.PORT || 3000;
    myConsoleSuccess_1.myConsoleSuccess("Trying to access port " + port);
    app.listen(port, async () => {
        myConsoleSuccess_1.myConsoleSuccess("Listening to port " + port);
        // scrape lolrates every 1h
        scrapeLolRates_1.scrapeLolRates();
        setInterval(async () => {
            scrapeLolRates_1.scrapeLolRates();
        }, 60 * 1000 * 60);
        myConsoleSuccess_1.myConsoleSuccess("Pinging every 15 min at https://endohio-server.herokuapp.com/");
        createPreferencesForAll_1.createPreferencesForAll();
        createProfileForAll_1.createProfileForUsers();
        createUserSuggestionsForAll_1.createUserSuggestionsForAll();
        // renovar sugestões de usuários a cada 1h
        setInterval(async () => {
            createUserSuggestionsForAll_1.createUserSuggestionsForAll();
        }, 60 * 1000 * 60);
        // Ping every15 min to avoid Heroku's server sleep
        // Maybe split into different file?
        setInterval(async () => {
            node_fetch_1.default("https://endohio-server.herokuapp.com/")
                .then((res) => res.json())
                .then((json) => myConsoleSuccess_1.myConsoleSuccess("GET OK https://endohio-server.herokuapp.com/"));
            try {
                const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                const deleted = await userRepo.deleteExpiredTempUsers();
                myConsoleSuccess_1.myConsoleSuccess("Deleting expired temp users");
            }
            catch (e) {
                myConsoleError_1.myConsoleError(e.message);
            }
        }, 60 * 1000 * 15);
    });
})
    .catch((error) => myConsoleError_1.myConsoleError(error));
