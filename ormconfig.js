
require('dotenv').config()

// isso serve apenas para executar as migrations em produção!
// Roda durante o typeorm migration:run


// if dev mode
let ormconfig = {
   type: "postgres",
   host: 'localhost',
   port: 5432,
   username: 'postgres',
   password: 'password',
   database: "endoh.io",
   entities: [
      __dirname + "/src/entities/**/*.ts",
   ],
   synchronize: false,
   logging: false,
   migrations: [
      __dirname + "/src/migrations/**/*.ts",
   ],
   subscribers: [
      __dirname + "/src/subscriber/**/*.ts",
   ],
   cli: {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscriber",
   },
}

if (process.env.NODE_ENV === 'production') {
   ormconfig = {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: "endoh.io",
      entities: [
         __dirname + "/build/entities/**/*.js"
      ],
      synchronize: false,
      logging: false,
      migrations: [
         __dirname + "/build/migrations/**/*.js",
      ],
      subscribers: [
         __dirname + "/build/subscriber/**/*.js",
      ],
      cli: {
         "entitiesDir": __dirname + "build/src/entities",
         "migrationsDir": __dirname + "build/src/migrations",
         "subscribersDir": __dirname + "build/src/subscriber",
      }
   }
}

module.exports = ormconfig