import { ConnectionOptions } from 'typeorm';
import { DotEnvNames } from './src/consts/dotenv';
require('dotenv').config()

const ormconfig: ConnectionOptions =
{
   type: "postgres",
   host: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvNames.DB_HOST] : 'localhost',
   port: process.env.NODE_ENV?.trim() === 'production' ?
      Number(process.env[DotEnvNames.DB_PORT]) : 5432,
   username: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvNames.DB_USERNAME] : 'postgres',
   password: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvNames.DB_PASSWORD] : 'password',
   database: "endoh.io",
   entities: [
      "src/entity/**/*.ts"
   ],
   synchronize: true,
   logging: false,

   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   },
}

export default ormconfig