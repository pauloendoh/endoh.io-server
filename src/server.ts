import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import fetch from 'node-fetch';
// Why did I import this for?
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { myConsoleError } from './utils/myConsoleError';
import { myConsoleSuccess } from './utils/myConsoleSuccess';

// It must use 'require' to work properly. 
const ormconfig = require('../ormconfig')


// PE 2/3 
createConnection(ormconfig).then(async connection => {

    const app = express()
    app.use(cors())

    // For testing 
    app.get('/', (req, res) => res.json('nice?'))

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0 
    app.use(bodyParser.urlencoded({ extended: false }))

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(bodyParser.json());

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

    app.listen(port, () => {
        
        myConsoleSuccess('Pinging every 15 min at https://endohio-server.herokuapp.com/')
        
        // Ping every15 min to avoid Heroku's server sleep 
        // Maybe split into different file?
        setInterval(() => {
            fetch('https://endohio-server.herokuapp.com/')
                .then(res => res.json())
                .then(json => myConsoleSuccess('GET OK https://endohio-server.herokuapp.com/'))
        }, 60 * 1000 * 15) 
    })


}).catch(error => myConsoleError(error));

