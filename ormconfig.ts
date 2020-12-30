import { ConnectionOptions } from 'typeorm';
import { DotEnvKeys } from './src/enums/DotEnvKeys';
require('dotenv').config()

const ormconfig: ConnectionOptions =
{
   type: "postgres",
   host: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvKeys.DB_HOST] : 'localhost',
   port: process.env.NODE_ENV?.trim() === 'production' ?
      Number(process.env[DotEnvKeys.DB_PORT]) : 5432,
   username: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvKeys.DB_USERNAME] : 'postgres',
   password: process.env.NODE_ENV?.trim() === 'production' ?
      process.env[DotEnvKeys.DB_PASSWORD] : 'password',
   database: "endoh.io",
   entities: [
      "src/entities/**/*.ts"
   ],
   synchronize: false,
   logging: process.env.NODE_ENV?.trim() === 'production' ?
      false : true,

   migrations: [
      "src/migrations/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscriber"
   },
}

module.exports = ormconfig