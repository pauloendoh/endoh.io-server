
require('dotenv').config()

// isso serve apenas para executar as migrations em produção!
// Roda durante o typeorm migration:run
const ormconfig = {
   type: "postgres",
   host: process.env[DB_HOST],
   port: Number(process.env[DB_PORT]),
   username: process.env[DB_USERNAME],
   password: process.env[DB_PASSWORD],
   database: "endoh.io",
   entities: [
      __dirname + "/build/src/entities/**/*.js",
   ],

   cli: {
      "entitiesDir": "build/src/entities",
      "migrationsDir": "build/src/migrations",
      "subscribersDir": "build/src/subscriber"
   },
}


module.exports = ormconfig