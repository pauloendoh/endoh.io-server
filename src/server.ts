import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { createConnection as connectTypeorm } from 'typeorm';

import authRoute from './routes/authRoute';
import expenseRoute from './routes/monerate/expenseRoute';
import { myConsoleError } from './utils/myConsoleError';
import { myConsoleSuccess } from './utils/myConsoleSuccess';

connectTypeorm().then(async connection => {

    const app = express()

    app.use(cors())

    // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0 
    app.use(bodyParser.urlencoded({ extended: false }))

    // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
    app.use(bodyParser.json());

    // PE 2/3 - might have an easier way to make this automatic, no?
    app.get('/', (req, res) => res.json('nice?'))
    app.use('/auth', authRoute)
    app.use('/monerate/expense', expenseRoute)

    app.listen(8080, () => {
        myConsoleSuccess("******* Server has started, LET'S FUCKING GOOOO!!! *******  \n")
    })
}).catch(error => myConsoleError(error));

