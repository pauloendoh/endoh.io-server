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
exports.sendPasswordResetEmail = void 0;
var crypto_1 = require("crypto");
var typeorm_1 = require("typeorm");
var USER_TOKEN_TYPES_1 = require("../../consts/USER_TOKEN_TYPES");
var OAuthToken_1 = require("../../entities/OAuthToken");
var myConsoleSuccess_1 = require("../myConsoleSuccess");
var addMinutes_1 = require("../time/addMinutes");
var nodemailer = require("nodemailer");
require('dotenv').config();
// async..await is not allowed in global scope, must use a wrapper
function sendPasswordResetEmail(user) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, userTokenRepo, token, url, sentEmailInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'endohpa@gmail.com',
                            pass: process.env.EMAIL_PASS,
                        },
                    });
                    userTokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
                    // removes all the previous password reset tokens from the user 
                    return [4 /*yield*/, userTokenRepo.delete({
                            userId: user.id,
                            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset
                        })];
                case 1:
                    // removes all the previous password reset tokens from the user 
                    _a.sent();
                    return [4 /*yield*/, userTokenRepo.save({
                            userId: user.id,
                            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset,
                            token: crypto_1.randomBytes(64).toString('hex'),
                            expiresAt: addMinutes_1.addMinutes(new Date(), 15).toISOString()
                        })];
                case 2:
                    token = _a.sent();
                    url = process.env.CLIENT_BASE_URL + "/password-reset?token=" + token.token + "&userId=" + user.id;
                    return [4 /*yield*/, transporter.sendMail({
                            from: '"Endoh.io" <endohpa@gmail.com>',
                            to: user.email,
                            subject: "Endoh.io - Password reset",
                            text: "Enter this link to complete your password reset: ",
                            html: "Enter this link to complete your password reset: <br/>\n            <a href=\"" + url + "\">" + url + "</a>\n        ",
                        })];
                case 3:
                    sentEmailInfo = _a.sent();
                    myConsoleSuccess_1.myConsoleSuccess("Message sent: " + sentEmailInfo.messageId);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=sendPasswordResetEmail.js.map