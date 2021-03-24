import { ConnectionOptions } from 'typeorm';
import { DotEnvKeys } from './src/enums/DotEnvKeys';
require('dotenv').config()

// não adianta deixar dentro de /config/ ? 

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
      __dirname + "/src/entities/**/*.ts",
      __dirname + "/src/entities/**/*.js",
   ],
   synchronize: false,
   logging:
      true,

   migrations: [
      __dirname + "/src/migrations/**/*.ts",
      __dirname + "/src/migrations/**/*.js",
   ],
   subscribers: [
      __dirname + "/src/subscriber/**/*.ts",
      __dirname + "/src/subscriber/**/*.js",
   ],
   cli: {
      "entitiesDir":
         process.env.NODE_ENV?.trim() === 'production' ? "build/src/entities" : "src/entities",
      "migrationsDir":
         process.env.NODE_ENV?.trim() === 'production' ? "build/src/migrations" : "src/migrations",
      "subscribersDir":
         process.env.NODE_ENV?.trim() === 'production' ? "build/src/subscriber" : "src/subscriber",

   },
}

module.exports = ormconfig