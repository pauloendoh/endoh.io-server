
require('dotenv').config()

// isso serve apenas para executar as migrations em produção!
// Roda durante o typeorm migration:run


// if desenv
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
   logging:
      true,

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
      host:
         process.env.DB_HOST,
      port:
         Number(process.env.DB_PORT),
      username:
         process.env.DB_USERNAME,
      password:
         process.env.DB_PASSWORD,
      database: "endoh.io",
      entities: [
         __dirname + "/src/entities/**/*.js",
      ],
      synchronize: false,
      logging:
         true,

      migrations: [
         __dirname + "/src/migrations/**/*.js",
      ],
      subscribers: [
         __dirname + "/src/subscriber/**/*.js",
      ],
      cli: {
         "entitiesDir": "build/src/entities",
         "migrationsDir": "build/src/migrations",
         "subscribersDir": "build/src/subscriber",

      }
   }
}

module.exports = ormconfig