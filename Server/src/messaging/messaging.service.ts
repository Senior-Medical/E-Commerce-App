import { Injectable } from "@nestjs/common";
import { MailDataRequired } from "@sendgrid/mail";
import { SendGridClient } from './sendGridClient.service';

@Injectable()
export class MessagingService {
  constructor(
    private readonly sendGridClient: SendGridClient,
  ) { }

  sendEmail(emailData: {email: string, message: string, subject: string}) {
    const mail: MailDataRequired = {
      to: emailData.email,
      from: "",
      subject: emailData.subject,
      text: emailData.message
    };
    return this.sendGridClient.sendEmail(mail);
  }


}