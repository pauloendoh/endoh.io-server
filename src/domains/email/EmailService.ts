import { MailService } from "@sendgrid/mail"
import { User } from "../../entities/User"
import { myEnvs } from "../../utils/myEnvs"

export class EmailService {
  constructor(private sendgridService = new MailService()) {
    this.sendgridService.setApiKey(myEnvs.SENDGRID_API_KEY)
  }

  notifyNewUserToDevs(user: User) {
    const devsEmailsString = process.env.NOTIFY_NEW_USER_TO_DEVS

    if (!devsEmailsString?.trim()) return

    const devsEmails = devsEmailsString.split(";").map((s) => s.trim())

    const subject = user.expiresAt
      ? "[relearn.to] - New TEMP user"
      : "[relearn.to] - New user: " + user.username

    this.sendgridService
      .send({
        to: devsEmails,
        from: "endohpa@gmail.com",
        subject,
        html: `
        <div>

        <a href="https://relearn.to/user/${user.username}">View profile</a>
        </div>
        `,
      })
      .then(() => {
        console.log("Email sent!")
      })
      .catch((error) => {
        console.log(error.message)
      })
  }
}
