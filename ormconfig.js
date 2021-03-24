
require('dotenv').config()

// isso serve apenas para executar as migrations em produção!
// Roda durante o typeorm migration:run
const ormconfig = {
   type: "postgres",
   host: process.env.NODE_ENV === 'production' ?
      process.env.DB_HOST : 'localhost',
   port: process.env.NODE_ENV === 'production' ?
      Number(process.env.DB_PORT) : 5432,
   username: process.env.NODE_ENV === 'production' ?
      process.env.DB_USERNAME : 'postgres',
   password: process.env.NODE_ENV === 'production' ?
      process.env.DB_PASSWORD : 'password',
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
         process.env.NODE_ENV === 'production' ? "build/src/entities" : "src/entities",
      "migrationsDir":
         process.env.NODE_ENV === 'production' ? "build/src/migrations" : "src/migrations",
      "subscribersDir":
         process.env.NODE_ENV === 'production' ? "build/src/subscriber" : "src/subscriber",

   },
}


module.exports = ormconfig