import * as sgMail from "@sendgrid/mail";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function sendGridRoute(expressApp: Application) {
  return <Resource>{
    get: {
      handler: async (_, res: Response) => {
        try {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          sgMail
            .send({
              to: "pauloendoh@gmail.com",
              from: "endohpa@gmail.com",
              subject: "Hello!",
              text: "Hello from SendGrid",
              html: "<h1>Hello from sendgrid</h1>",
            })
            .then(() => res.status(200).json({ message: "Email sent" }))
            .catch((error) => res.status(400).json({ error: error }));
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
