import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import fetch from 'node-fetch';
// Why did I import this for?
import 'reflect-metadata';
import { createConnection, getCustomRepository } from 'typeorm';
import { myConsoleError } from './utils/myConsoleError';
import { myConsoleSuccess } from './utils/myConsoleSuccess';
import cookieSession = require("cookie-session");
import { PASSPORT_KEYS } from './consts/PASSPORT_KEYS';
import cookieParser = require("cookie-parser"); // parse cookie header
import passport = require("passport")
import { sendPasswordResetEmail } from './utils/email/sendPasswordResetEmail';
import UserRepository from './repositories/UserRepository';
import { createPreferencesForAll } from './utils/user/createPreferencesForAll';
import { createProfileForUsers } from './utils/user/createProfileForAll';
import { createUserSuggestionsForAll } from './utils/user/createUserSuggestionsForAll';
require("./utils/passport-setup")
require(`dotenv`).config()

// It must use 'require' to work properly. 
const ormconfig = require('../ormconfig')


// PE 2/3 
createConnection(ormconfig).then(async connection => {

    const app = express()
    app.use(cors())
    app.use('/auth/google/login', cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }))


    // For testing 
    app.get('/', (req, res) => res.json('nice?'))

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0 
    app.use(bodyParser.urlencoded({ extended: false }))

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(bodyParser.json());

    // passport https://gist.githubusercontent.com/leannezhang/8069d56a779f2b86da40dfd17c9e3efe/raw/d896c190174c8494e34592c9b1000fc058172d1d/index.js
    app.use(cookieSession({
        name: "endoh_google_session",
        keys: [PASSPORT_KEYS.COOKIE_KEY],

        maxAge: 15 * 60 * 1000 // 15 min
    })
    )
    app.use(cookieParser())
    // initialize passport
    app.use(passport.initialize());


    // deserialize cookie from the browser and adds to req.user 
    app.use(passport.session());

    // Automatically connect with /routes folder and subfolders
    fs.readdirSync(`${__dirname}/routes`).forEach(async (fileOrFolderName) => {
        if (fileOrFolderName.endsWith('.ts')) {
            const routeName = fileOrFolderName.split('Route')[0]
            const module = await import(`${__dirname}/routes/${fileOrFolderName}`)
            app.use(`/${routeName}`, module.default)
        }
        else {
            // subroutes from subfolders
            fs.readdirSync(`${__dirname}/routes/${fileOrFolderName}`).forEach(async (fileName) => {
                const routeName = fileName.split('Route')[0]
                const module = await import(`${__dirname}/routes/${fileOrFolderName}/${fileName}`)
                app.use(`/${fileOrFolderName}/${routeName}`, module.default)

            })
        }
    })

    const port = process.env.PORT || 3000
    app.listen(port, async () => {

        myConsoleSuccess('Pinging every 15 min at https://endohio-server.herokuapp.com/')

        createPreferencesForAll()
        createProfileForUsers()

        createUserSuggestionsForAll()

        // Ping every15 min to avoid Heroku's server sleep 
        // Maybe split into different file?
        setInterval(async () => {
            fetch('https://endohio-server.herokuapp.com/')
                .then(res => res.json())
                .then(json => myConsoleSuccess('GET OK https://endohio-server.herokuapp.com/'))

            try {
                const userRepo = getCustomRepository(UserRepository)

                const deleted = await userRepo.deleteExpiredTempUsers()
                myConsoleSuccess("Deleting expired temp users")
            }
            catch (e) {
                myConsoleError(e.message)
            }

        }, 60 * 1000 * 15)
    })


}).catch(error => myConsoleError(error));

