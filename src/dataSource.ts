import { DataSource } from "typeorm"

import { config } from "dotenv"

config()

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "endoh.io",
  entities: [__dirname + "/entities/**/*.{js,ts}"],
  synchronize: false, // set as 'true' if you're syncronizing for the first time

  migrations: [__dirname + "/migrations/**/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/**/*Subscriber.{js,ts}"],

  logging: ["error"],
})
