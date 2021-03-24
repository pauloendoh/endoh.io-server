"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var node_fetch_1 = require("node-fetch");
// Why did I import this for?
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var PASSPORT_KEYS_1 = require("./consts/PASSPORT_KEYS");
var UserRepository_1 = require("./repositories/UserRepository");
var myConsoleError_1 = require("./utils/myConsoleError");
var myConsoleSuccess_1 = require("./utils/myConsoleSuccess");
var createPreferencesForAll_1 = require("./utils/user/createPreferencesForAll");
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser"); // parse cookie header
var passport = require("passport");
var process_1 = require("process");
require("./utils/passport-setup");
require("dotenv").config();
// It must use 'require' to work properly. 
var ormconfig = require('../ormconfig');
// PE 2/3 
myConsoleSuccess_1.myConsoleSuccess("Connecting with ormconfig");
typeorm_1.createConnection(ormconfig).then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var app, port;
    return __generator(this, function (_a) {
        myConsoleSuccess_1.myConsoleSuccess("Connected!");
        app = express();
        app.use(cors());
        app.use('/auth/google/login', cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
        // For testing 
        app.get('/', function (req, res) { return res.json('nice?'); });
        // https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0 
        app.use(express.urlencoded({ extended: false }));
        // https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
        app.use(express.json());
        // passport https://gist.githubusercontent.com/leannezhang/8069d56a779f2b86da40dfd17c9e3efe/raw/d896c190174c8494e34592c9b1000fc058172d1d/index.js
        app.use(cookieSession({
            name: "endoh_google_session",
            keys: [PASSPORT_KEYS_1.PASSPORT_KEYS.COOKIE_KEY],
            maxAge: 15 * 60 * 1000 // 15 min
        }));
        app.use(cookieParser());
        // initialize passport
        app.use(passport.initialize());
        // deserialize cookie from the browser and adds to req.user 
        app.use(passport.session());
        // Automatically connect with /routes folder and subfolders
        console.log("Memory usage: " + ((process_1.memoryUsage().rss / 1024) / 1024) + "MB");
        myConsoleSuccess_1.myConsoleSuccess("Setting up routes");
        fs.readdirSync(__dirname + "/routes").forEach(function (fileOrFolderName) { return __awaiter(void 0, void 0, void 0, function () {
            var routeName, module_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(fileOrFolderName.endsWith('.ts') || fileOrFolderName.endsWith('.js'))) return [3 /*break*/, 2];
                        routeName = fileOrFolderName.split('Route')[0];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require(__dirname + "/routes/" + fileOrFolderName); })];
                    case 1:
                        module_1 = _a.sent();
                        app.use("/" + routeName, module_1.default);
                        return [3 /*break*/, 3];
                    case 2:
                        // subroutes from subfolders
                        fs.readdirSync(__dirname + "/routes/" + fileOrFolderName).forEach(function (fileName) { return __awaiter(void 0, void 0, void 0, function () {
                            var routeName, module;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        routeName = fileName.split('Route')[0];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require(__dirname + "/routes/" + fileOrFolderName + "/" + fileName); })];
                                    case 1:
                                        module = _a.sent();
                                        app.use("/" + fileOrFolderName + "/" + routeName, module.default);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        port = process.env.PORT || 3000;
        myConsoleSuccess_1.myConsoleSuccess("Trying to access port " + port);
        app.listen(port, function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                myConsoleSuccess_1.myConsoleSuccess("Listening to port " + port);
                myConsoleSuccess_1.myConsoleSuccess('Pinging every 15 min at https://endohio-server.herokuapp.com/');
                createPreferencesForAll_1.createPreferencesForAll();
                // createProfileForUsers()
                // createUserSuggestionsForAll()
                // // renovar sugestões de usuários a cada 1h
                // setInterval(async () => {
                //     createUserSuggestionsForAll()
                // }, 60 * 1000 * 60)
                // Ping every15 min to avoid Heroku's server sleep 
                // Maybe split into different file?
                setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var userRepo, deleted, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                node_fetch_1.default('https://endohio-server.herokuapp.com/')
                                    .then(function (res) { return res.json(); })
                                    .then(function (json) { return myConsoleSuccess_1.myConsoleSuccess('GET OK https://endohio-server.herokuapp.com/'); });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                                return [4 /*yield*/, userRepo.deleteExpiredTempUsers()];
                            case 2:
                                deleted = _a.sent();
                                myConsoleSuccess_1.myConsoleSuccess("Deleting expired temp users");
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                myConsoleError_1.myConsoleError(e_1.message);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, 60 * 1000 * 15);
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); }).catch(function (error) { return myConsoleError_1.myConsoleError(error); });
//# sourceMappingURL=server.js.map