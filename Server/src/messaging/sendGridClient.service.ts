import { Injectable, Logger } from "@nestjs/common";
// import { MailDataRequired, send, setApiKey } from '@sendgrid/mail';
import * as sendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendGridClient {
  private logger: Logger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(SendGridClient.name);
    sendGrid.setApiKey(configService.get<string>("SENDGRID_API_KEY"));
  }

  async sendEmail(data: sendGrid.MailDataRequired) {
    try {
      data.from = this.configService.get<string>("SENDGRID_FROM_EMAIL");
      await sendGrid.send(data);
      this.logger.log("Email sent successfully to " + data.to);
    } catch (error) {
      this.logger.error("Error: " + error);
    }
  }
}