import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import * as express from 'express'
import authRoute from './routes/authRoute';
import * as cors from 'cors'
import * as bodyParser from "body-parser";
import { myConsoleError } from './utils/myConsoleError';
import { myConsoleSuccess } from './utils/myConsoleSuccess';

createConnection().then(async connection => {

    const app = express()

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false })) // ?
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        return res.json('nice?')
    })
    app.use('/auth', authRoute)

    app.listen(8080, () => { myConsoleSuccess("******* Server has started, LET'S FUCKING GOOOO!!! *******  \n") })
}).catch(error => myConsoleError(error));

