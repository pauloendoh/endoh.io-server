import sgMail from "@sendgrid/mail"
import { randomBytes } from "crypto"
import { USER_TOKEN_TYPES } from "../../consts/USER_TOKEN_TYPES"
import { dataSource } from "../../dataSource"
import { UserToken } from "../../entities/OAuthToken"
import { User } from "../../entities/User"
import { myConsoleSuccess } from "../myConsoleSuccess"
import { myEnvs } from "../myEnvs"
import { addMinutes } from "../time/addMinutes"

require("dotenv").config()

// async..await is not allowed in global scope, must use a wrapper
export async function sendPasswordResetEmail(user: User) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  const userTokenRepo = dataSource.getRepository(UserToken)

  // removes all the previous password reset tokens from the user
  await userTokenRepo.delete({
    userId: user.id,
    type: USER_TOKEN_TYPES.passwordReset,
  })

  const token = await userTokenRepo.save({
    userId: user.id,
    type: USER_TOKEN_TYPES.passwordReset,
    token: randomBytes(64).toString("hex"),
    expiresAt: addMinutes(new Date(), 15).toISOString(),
  })

  const url =
    process.env.CLIENT_BASE_URL +
    "/password-reset?token=" +
    token.token +
    "&userId=" +
    user.id

  sgMail.setApiKey(myEnvs.SENDGRID_API_KEY)

  const responses = await sgMail.send({
    from: "endohpa@gmail.com",
    to: user.email, // list of receivers
    subject: "relearn.to - Password reset", // Subject line
    text: "Enter this link to complete your password reset: ",
    html: `Enter this link to complete your password reset: <br/>
            <a href="${url}">${url}</a>
        `,
  })

  myConsoleSuccess(responses[0].toString())

  return responses
}
