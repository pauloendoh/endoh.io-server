"use strict";

import { randomBytes } from 'crypto';
import { getRepository } from 'typeorm';
import { USER_TOKEN_TYPES } from '../../consts/USER_TOKEN_TYPES';
import { UserToken } from '../../entities/OAuthToken';
import { User } from '../../entities/User';
import { myConsoleSuccess } from '../myConsoleSuccess';
import { addMinutes } from '../time/addMinutes';

const nodemailer = require("nodemailer");
require('dotenv').config()

// async..await is not allowed in global scope, must use a wrapper
export async function sendPasswordResetEmail(user: User) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'endohpa@gmail.com', // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
    });

    const userTokenRepo = getRepository(UserToken)

    // removes all the previous password reset tokens from the user 
    await userTokenRepo.delete({
        userId: user.id,
        type: USER_TOKEN_TYPES.passwordReset
    })

    const token = await userTokenRepo.save({
        userId: user.id,
        type: USER_TOKEN_TYPES.passwordReset,
        token: randomBytes(64).toString('hex'),
        expiresAt: addMinutes(new Date(), 15).toISOString()
    })

    const url = process.env.CLIENT_BASE_URL + "/password-reset?token=" + token.token + "&userId=" + user.id

    // send mail with defined transport object
    let sentEmailInfo = await transporter.sendMail({
        from: '"Endoh.io" <endohpa@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Endoh.io - Password reset", // Subject line
        text: "Enter this link to complete your password reset: ",
        html: `Enter this link to complete your password reset: <br/>
            <a href="${url}">${url}</a>
        `,
    });

    myConsoleSuccess("Message sent: " + sentEmailInfo.messageId)

}


