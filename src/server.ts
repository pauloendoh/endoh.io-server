import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection as connectTypeorm } from 'typeorm';
import authRoute from './routes/authRoute';
import categoryRoute from './routes/monerate/categoryRoute';
import expenseRoute from './routes/monerate/expenseRoute';
import placeRoute from './routes/monerate/placeRoute';
import { myConsoleError } from './utils/myConsoleError';
import { myConsoleSuccess } from './utils/myConsoleSuccess';
import * as fs from 'fs'




connectTypeorm().then(async connection => {
    const app = express()
    app.use(cors())

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0 
    app.use(bodyParser.urlencoded({ extended: false }))

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(bodyParser.json());

    // PE 2/3 - might have an easier way to make this automatic, no?
    app.get('/', (req, res) => res.json('nice?'))

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

    app.listen(8080, () => {
        myConsoleSuccess("******* Server has started, LET'S FUCKING GOOOO!!! *******  \n")
    })
}).catch(error => myConsoleError(error));

