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



connectTypeorm().then(async connection => {
    process.env.TZ = 'utc'
    
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
    app.use('/monerate/place', placeRoute)
    app.use('/monerate/category', categoryRoute)

    app.listen(8080, () => {
        myConsoleSuccess("******* Server has started, LET'S FUCKING GOOOO!!! *******  \n")
    })
}).catch(error => myConsoleError(error));

