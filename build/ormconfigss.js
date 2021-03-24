"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
var DotEnvKeys_1 = require("./src/enums/DotEnvKeys");
require('dotenv').config();
// não adianta deixar dentro de /config/ ? 
var ormconfig = {
    type: "postgres",
    host: ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'production' ?
        process.env[DotEnvKeys_1.DotEnvKeys.DB_HOST] : 'localhost',
    port: ((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.trim()) === 'production' ?
        Number(process.env[DotEnvKeys_1.DotEnvKeys.DB_PORT]) : 5432,
    username: ((_c = process.env.NODE_ENV) === null || _c === void 0 ? void 0 : _c.trim()) === 'production' ?
        process.env[DotEnvKeys_1.DotEnvKeys.DB_USERNAME] : 'postgres',
    password: ((_d = process.env.NODE_ENV) === null || _d === void 0 ? void 0 : _d.trim()) === 'production' ?
        process.env[DotEnvKeys_1.DotEnvKeys.DB_PASSWORD] : 'password',
    database: "endoh.io",
    entities: [
        __dirname + "/src/entities/**/*.ts",
        __dirname + "/src/entities/**/*.js",
    ],
    synchronize: false,
    logging: true,
    migrations: [
        __dirname + "/src/migrations/**/*.ts",
        __dirname + "/src/migrations/**/*.js",
    ],
    subscribers: [
        __dirname + "/src/subscriber/**/*.ts",
        __dirname + "/src/subscriber/**/*.js",
    ],
    cli: {
        "entitiesDir": ((_e = process.env.NODE_ENV) === null || _e === void 0 ? void 0 : _e.trim()) === 'production' ? "build/src/entities" : "src/entities",
        "migrationsDir": ((_f = process.env.NODE_ENV) === null || _f === void 0 ? void 0 : _f.trim()) === 'production' ? "build/src/migrations" : "src/migrations",
        "subscribersDir": ((_g = process.env.NODE_ENV) === null || _g === void 0 ? void 0 : _g.trim()) === 'production' ? "build/src/subscriber" : "src/subscriber",
    },
};
module.exports = ormconfig;
//# sourceMappingURL=ormconfigss.js.map