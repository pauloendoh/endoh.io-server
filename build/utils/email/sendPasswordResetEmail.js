"use strict";
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
async function sendPasswordResetEmail(user) {
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
    await userTokenRepo.delete({
        userId: user.id,
        type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset
    });
    const token = await userTokenRepo.save({
        userId: user.id,
        type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset,
        token: crypto_1.randomBytes(64).toString('hex'),
        expiresAt: addMinutes_1.addMinutes(new Date(), 15).toISOString()
    });
    const url = process.env.CLIENT_BASE_URL + "/password-reset?token=" + token.token + "&userId=" + user.id;
    // send mail with defined transport object
    let sentEmailInfo = await transporter.sendMail({
        from: '"Endoh.io" <endohpa@gmail.com>',
        to: user.email,
        subject: "Endoh.io - Password reset",
        text: "Enter this link to complete your password reset: ",
        html: `Enter this link to complete your password reset: <br/>
            <a href="${url}">${url}</a>
        `,
    });
    myConsoleSuccess_1.myConsoleSuccess("Message sent: " + sentEmailInfo.messageId);
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
