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
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var typeorm_1 = require("typeorm");
var UserRepository_1 = require("../repositories/UserRepository");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    /*
    Instead of user this function usually recives the id
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_BASE_URL + "/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function () {
        var userRepo, currentUser, email, userWithEmail, username, salt, randomString, newUser, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                    return [4 /*yield*/, userRepo.findOne({
                            googleId: profile.id
                        })];
                case 1:
                    currentUser = _d.sent();
                    if (!!currentUser) return [3 /*break*/, 10];
                    email = profile.emails[0].value;
                    return [4 /*yield*/, userRepo.findOne({ email: email })];
                case 2:
                    userWithEmail = _d.sent();
                    if (!userWithEmail) return [3 /*break*/, 4];
                    userWithEmail.googleId = profile.id;
                    return [4 /*yield*/, userRepo.save(userWithEmail)];
                case 3:
                    _d.sent();
                    return [2 /*return*/, done(null, userWithEmail)];
                case 4: return [4 /*yield*/, userRepo.getAvailableUsernameByEmail(email)];
                case 5:
                    username = _d.sent();
                    return [4 /*yield*/, bcrypt_1.genSalt(10)];
                case 6:
                    salt = _d.sent();
                    randomString = crypto_1.randomBytes(64).toString('hex');
                    _b = (_a = userRepo).save;
                    _c = {
                        googleId: profile.id,
                        username: username,
                        email: email
                    };
                    return [4 /*yield*/, bcrypt_1.hash(randomString, salt)];
                case 7: return [4 /*yield*/, _b.apply(_a, [(_c.password = _d.sent(),
                            _c)])];
                case 8:
                    newUser = _d.sent();
                    return [4 /*yield*/, userRepo.save(newUser)];
                case 9:
                    _d.sent();
                    return [2 /*return*/, done(null, newUser)];
                case 10: return [2 /*return*/, done(null, currentUser)];
            }
        });
    });
}));
//# sourceMappingURL=passport-setup.js.map