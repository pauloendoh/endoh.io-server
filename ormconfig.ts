import { DotEnvNames } from './src/consts/dotenv';
module.exports =
{
   "type": "postgres",
   "host": process.env.NODE_ENV.trim() === 'production' ?
      process.env[DotEnvNames.DB_HOST] : 'localhost',
   "port": process.env.NODE_ENV.trim() === 'production' ?
      process.env[DotEnvNames.DB_PORT] : 5432,
   "username": process.env.NODE_ENV.trim() === 'production' ?
      process.env[DotEnvNames.DB_USERNAME] : 'postgres',
   "password": process.env.NODE_ENV.trim() === 'production' ?
      process.env[DotEnvNames.DB_PASSWORD] : 'password',
   "database": "endoh.io",

   "synchronize": true,

   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}