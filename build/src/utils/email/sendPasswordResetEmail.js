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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const crypto_1 = require("crypto");
const typeorm_1 = require("typeorm");
const USER_TOKEN_TYPES_1 = require("../../consts/USER_TOKEN_TYPES");
const OAuthToken_1 = require("../../entities/OAuthToken");
const myConsoleSuccess_1 = require("../myConsoleSuccess");
const addMinutes_1 = require("../time/addMinutes");
const nodemailer = require("nodemailer");
require('dotenv').config();
// async..await is not allowed in global scope, must use a wrapper
function sendPasswordResetEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'endohpa@gmail.com',
                pass: process.env.EMAIL_PASS,
            },
        });
        const userTokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
        // removes all the previous password reset tokens from the user 
        yield userTokenRepo.delete({
            userId: user.id,
            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset
        });
        const token = yield userTokenRepo.save({
            userId: user.id,
            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset,
            token: crypto_1.randomBytes(64).toString('hex'),
            expiresAt: addMinutes_1.addMinutes(new Date(), 15).toISOString()
        });
        const url = process.env.CLIENT_BASE_URL + "/password-reset?token=" + token.token + "&userId=" + user.id;
        // send mail with defined transport object
        let sentEmailInfo = yield transporter.sendMail({
            from: '"Endoh.io" <endohpa@gmail.com>',
            to: user.email,
            subject: "Endoh.io - Password reset",
            text: "Enter this link to complete your password reset: ",
            html: `Enter this link to complete your password reset: <br/>
            <a href="${url}">${url}</a>
        `,
        });
        myConsoleSuccess_1.myConsoleSuccess("Message sent: " + sentEmailInfo.messageId);
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=sendPasswordResetEmail.js.map