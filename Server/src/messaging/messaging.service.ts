import { Injectable } from "@nestjs/common";
import { MailDataRequired } from "@sendgrid/mail";
import { SendGridClient } from './sendGridClient.service';
import { MailData } from "./types/mailData.type";

@Injectable()
export class MessagingService {
  constructor(
    private readonly sendGridClient: SendGridClient,
  ) { }

  sendEmail(emailData: MailData) {
    const mail: MailDataRequired = {
      to: emailData.to,
      from: "",
      subject: emailData.subject,
      text: emailData.message
    };
    return this.sendGridClient.sendEmail(mail);
  }


}