import { Injectable, Logger } from "@nestjs/common";
import { MailDataRequired } from "@sendgrid/mail";
import { MailData } from "./types/mailData.type";
import { ConfigService } from '@nestjs/config';
import * as sendGrid from '@sendgrid/mail';
import * as twilio from "twilio";
import { SmsData } from "./types/smsData.type";

/**
 * - Handles sending emails via SendGrid and SMS via Twilio.
 * - Uses environment variables for Twilio and SendGrid API keys, and other configurations.
 * 
 * Methods:
 * - sendEmail: Sends an email using SendGrid.
 * - sendSMS: Sends an SMS using Twilio.
 */
@Injectable()
export class MessagingService {
  private logger: Logger;
  private twilioClient;


  constructor(
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = twilio(
      configService.get<string>("TWILIO_ACCOUNT_SID"),
      configService.get<string>("TWILIO_AUTH_TOKEN")
    );
    this.logger = new Logger(MessagingService.name);
    sendGrid.setApiKey(configService.get<string>("SENDGRID_API_KEY"));
  }

  /**
   * sendEmail - Sends an email using SendGrid.
   * @param emailData - The data required to send the email.
   */
  async sendEmail(emailData: MailData) {
    const mail: MailDataRequired = {
      to: emailData.to,
      from: "",
      subject: emailData.subject,
      text: emailData.message
    };
    try {
      mail.from = this.configService.get<string>("SENDGRID_FROM_EMAIL");
      await sendGrid.send(mail);
      this.logger.log("Email sent successfully to " + mail.to);
    } catch (error) {
      this.logger.error("Email send error: " + error);
    }
  }

  /**
   * sendSMS - Sends an SMS using Twilio.
   * @param smsData - The data required to send the SMS.
   */
  async sendSMS(smsData: SmsData) {
    try {
      await this.twilioClient.messages.create({
        body: smsData.message,
        from: this.configService.get<string>("TWILIO_PHONE_NUMBER"),
        to: smsData.to
      });
      this.logger.log("SMS sent successfully to " + smsData.to);
    } catch (error) {
      this.logger.error("SMS send error: " + error);
    }
  }
}