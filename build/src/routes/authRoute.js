"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var passport = require("passport");
var typeorm_1 = require("typeorm");
var USER_TOKEN_TYPES_1 = require("../consts/USER_TOKEN_TYPES");
var OAuthToken_1 = require("../entities/OAuthToken");
var UserPreference_1 = require("../entities/UserPreference");
var DotEnvKeys_1 = require("../enums/DotEnvKeys");
var AuthUserGetDto_1 = require("../interfaces/dtos/auth/AuthUserGetDto");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var UserRepository_1 = require("../repositories/UserRepository");
var ErrorMessage_1 = require("../utils/ErrorMessage");
var myConsoleError_1 = require("../utils/myConsoleError");
var addMinutes_1 = require("../utils/time/addMinutes");
var validateUser_1 = require("../utils/validateUser");
require('../utils/passport-setup');
require('dotenv').config();
var authRoute = express_1.Router();
// PE 2/3
authRoute.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepo, sentUser, userErrors, userExists, regex, salt, _a, savedUser_1, expireDate_1, ONE_YEAR_IN_SECONDS, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                sentUser = userRepo.create(__assign({}, req.body));
                userErrors = validateUser_1.default(sentUser);
                if (userErrors.length) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse().addErrors(userErrors))];
                }
                return [4 /*yield*/, userRepo.findOne({ email: sentUser.email })];
            case 1:
                userExists = _b.sent();
                if (userExists) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Email already in use', 'email'))];
                }
                return [4 /*yield*/, userRepo.findOne({ username: sentUser.username })];
            case 2:
                // Checking if username exists
                userExists = _b.sent();
                if (userExists) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Username already in use', 'username'))];
                }
                regex = new RegExp(/^[a-zA-Z0-9]+$/);
                if (!regex.test(sentUser.username)) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid characters for username. Only use letters and numbers.'))];
                }
                return [4 /*yield*/, bcrypt_1.genSalt(10)];
            case 3:
                salt = _b.sent();
                _a = sentUser;
                return [4 /*yield*/, bcrypt_1.hash(sentUser.password, salt)];
            case 4:
                _a.password = _b.sent();
                return [4 /*yield*/, typeorm_1.getCustomRepository(UserRepository_1.default)
                        .saveAndGetRelations(sentUser)
                    //  = await userRepo.save(sentUser)
                ];
            case 5:
                savedUser_1 = _b.sent();
                expireDate_1 = new Date(new Date().setDate(new Date().getDate() + 365));
                ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
                jsonwebtoken_1.sign({ userId: savedUser_1.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, function (err, token) {
                    if (err)
                        throw err;
                    return res.json(new AuthUserGetDto_1.AuthUserGetDto(savedUser_1, token, expireDate_1));
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
// PE 2/3 - do some small easy improvements 
authRoute.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, fieldErrors, userRepo, user_1, passwordOk, expireDate_2, ONE_YEAR_IN_SECONDS, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                body = req.body;
                body.username = body.email; // We just use email here, but we don't want to validate empty username 
                fieldErrors = validateUser_1.default(body);
                if (fieldErrors.length) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse().addErrors(fieldErrors))];
                }
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.findOne({
                        where: [
                            { email: body.email },
                            { username: body.email }
                        ]
                    })];
            case 1:
                user_1 = _a.sent();
                if (!user_1) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid email or username'))];
                }
                return [4 /*yield*/, bcrypt_1.compare(body.password, user_1.password)];
            case 2:
                passwordOk = _a.sent();
                if (!passwordOk) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid password', 'password'))];
                }
                expireDate_2 = new Date(new Date().setDate(new Date().getDate() + 365));
                ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
                jsonwebtoken_1.sign({ userId: user_1.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, function (err, token) {
                    if (err)
                        throw err;
                    return res.json(new AuthUserGetDto_1.AuthUserGetDto(user_1, token, expireDate_2));
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PE 3/3
// Redirects to google auth page 
authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// PE 2/3 
// After successful authentication at google page...
authRoute.get('/google/callback', passport.authenticate('google'), function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenRepo, user, oauthToken, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    user = req.user;
                    return [4 /*yield*/, tokenRepo.save({
                            userId: user.id,
                            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.googleOauth,
                            token: crypto_1.randomBytes(64).toString('hex'),
                            expiresAt: addMinutes_1.addMinutes(new Date(), 15).toISOString()
                        })];
                case 2:
                    oauthToken = _a.sent();
                    res.redirect(process.env.CLIENT_BASE_URL + "?oauthToken=" + oauthToken.token + "&userId=" + oauthToken.userId);
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    myConsoleError_1.myConsoleError(err_3.message);
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// PE 2/3 
// The front-end uses the token and userId in the URL to finish the login 
authRoute.post('/google/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, token, oauthRepo, tokenExists, userRepo, user_2, expireDate_3, ONE_YEAR_IN_SECONDS, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, userId = _a.userId, token = _a.token;
                oauthRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
                return [4 /*yield*/, oauthRepo.findOne({
                        userId: userId,
                        token: token,
                        expiresAt: typeorm_1.MoreThan(new Date().toISOString())
                    })];
            case 1:
                tokenExists = _b.sent();
                if (!tokenExists) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("No OAuthToken found"))];
                }
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.findOne({ id: userId })];
            case 2:
                user_2 = _b.sent();
                expireDate_3 = new Date(new Date().setDate(new Date().getDate() + 365));
                ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
                req.logout();
                return [4 /*yield*/, oauthRepo.delete({ userId: user_2.id, type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.googleOauth })];
            case 3:
                _b.sent();
                jsonwebtoken_1.sign({ userId: user_2.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, function (err, token) {
                    if (err)
                        throw err;
                    return res.json(new AuthUserGetDto_1.AuthUserGetDto(user_2, token, expireDate_3));
                });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                myConsoleError_1.myConsoleError(err_4.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_4.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
// --------- password reset 
authRoute.post('/password-reset', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, token, userId, tokenRepo, tokenExists, userRepo, user, salt, _b, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                _a = req.body, password = _a.password, token = _a.token, userId = _a.userId;
                tokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
                return [4 /*yield*/, tokenRepo.findOne({
                        userId: userId,
                        token: token,
                        type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset,
                        expiresAt: typeorm_1.MoreThan(new Date().toISOString())
                    })
                    // se existe, faz a alteração de senha 
                ];
            case 1:
                tokenExists = _c.sent();
                if (!tokenExists) return [3 /*break*/, 7];
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.findOne({ id: userId })];
            case 2:
                user = _c.sent();
                return [4 /*yield*/, bcrypt_1.genSalt(10)];
            case 3:
                salt = _c.sent();
                _b = user;
                return [4 /*yield*/, bcrypt_1.hash(password, salt)];
            case 4:
                _b.password = _c.sent();
                return [4 /*yield*/, userRepo.save(user)];
            case 5:
                _c.sent();
                return [4 /*yield*/, tokenRepo.delete({ userId: userId, type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset })];
            case 6:
                _c.sent();
                res.status(200).send();
                _c.label = 7;
            case 7: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Token doesn't exists or is expired."))];
            case 8:
                err_5 = _c.sent();
                myConsoleError_1.myConsoleError(err_5.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_5.message))];
            case 9: return [2 /*return*/];
        }
    });
}); });
authRoute.post('/authenticated-password-change', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, user, passwordOk, userRepo, salt, newPasswordHashed, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                user = req.user;
                return [4 /*yield*/, bcrypt_1.compare(oldPassword, user.password)];
            case 1:
                passwordOk = _b.sent();
                if (!passwordOk) return [3 /*break*/, 5];
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, bcrypt_1.genSalt(10)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.hash(newPassword, salt)];
            case 3:
                newPasswordHashed = _b.sent();
                user.password = newPasswordHashed;
                return [4 /*yield*/, userRepo.save(user)];
            case 4:
                _b.sent();
                res.status(200).send();
                _b.label = 5;
            case 5: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Incorrect password"))];
            case 6:
                err_6 = _b.sent();
                myConsoleError_1.myConsoleError(err_6.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_6.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
authRoute.delete('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, user, passwordOk, userRepo, deleted, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                password = req.body.password;
                user = req.user;
                return [4 /*yield*/, bcrypt_1.compare(password, user.password)];
            case 1:
                passwordOk = _a.sent();
                if (!passwordOk) return [3 /*break*/, 3];
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.delete({ id: user.id })];
            case 2:
                deleted = _a.sent();
                return [2 /*return*/, res.status(200).send()];
            case 3: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Incorrect password"))];
            case 4:
                err_7 = _a.sent();
                myConsoleError_1.myConsoleError(err_7.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_7.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
authRoute.put('/username', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUsername, user, userRepo, usernameExists, regex, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                newUsername = req.body.newUsername;
                user = req.user;
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.findOne({ username: newUsername })];
            case 1:
                usernameExists = _a.sent();
                if (usernameExists) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Username already in use."))];
                }
                regex = new RegExp(/^[a-zA-Z0-9]+$/);
                if (!regex.test(newUsername)) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid characters for username. Only use letters and numbers.'))];
                }
                user.username = newUsername;
                return [4 /*yield*/, userRepo.save(user)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).send()];
            case 3:
                err_8 = _a.sent();
                myConsoleError_1.myConsoleError(err_8.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_8.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ========= TEMPORARY USER 
// PE 2/3 - do some small easy improvements 
authRoute.get('/temp-user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepo, username, expireDate_4, user_3, ONE_DAY_IN_SECONDS, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                return [4 /*yield*/, userRepo.getAvailableTempUsername()];
            case 1:
                username = _a.sent();
                expireDate_4 = new Date(new Date().setDate(new Date().getDate() + 1));
                return [4 /*yield*/, userRepo.save({
                        username: username,
                        email: username + '@' + username + '.com',
                        password: username,
                        expiresAt: expireDate_4.toISOString(),
                    })
                    // Signing in and returning  user's token 
                ];
            case 2:
                user_3 = _a.sent();
                ONE_DAY_IN_SECONDS = 3600 * 24;
                jsonwebtoken_1.sign({ userId: user_3.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_DAY_IN_SECONDS }, function (err, token) {
                    if (err)
                        throw err;
                    return res.json(new AuthUserGetDto_1.AuthUserGetDto(user_3, token, expireDate_4));
                });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _a.sent();
                myConsoleError_1.myConsoleError(err_9.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_9.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// talvez adicionar uma rota /user-preference ao invés de /auth/user-preference ?  
authRoute.get('/user-preference', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, preferenceRepo, found, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
                return [4 /*yield*/, preferenceRepo.findOne({ user: user })];
            case 1:
                found = _a.sent();
                return [2 /*return*/, res.status(200).json(found)];
            case 2:
                err_10 = _a.sent();
                myConsoleError_1.myConsoleError(err_10.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_10.message))];
            case 3: return [2 /*return*/];
        }
    });
}); });
authRoute.post('/user-preference', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, preference, preferenceRepo, saved, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                preference = req.body;
                preference.user = user;
                preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
                return [4 /*yield*/, preferenceRepo.save(preference)];
            case 1:
                saved = _a.sent();
                return [2 /*return*/, res.status(200).json(saved)];
            case 2:
                err_11 = _a.sent();
                myConsoleError_1.myConsoleError(err_11.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_11.message))];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = authRoute;
//# sourceMappingURL=authRoute.js.map