import { Injectable, Logger } from "@nestjs/common";
import { MailDataRequired } from "@sendgrid/mail";
import { ConfigService } from '@nestjs/config';
import * as sendGrid from '@sendgrid/mail';
import * as twilio from "twilio";
import { CodePurpose, CodeType } from "src/users/enums/code.enum";
import { VerificationCodes } from "src/users/entities/verificationCodes.entity";
import { Document } from "mongoose";

type codeDataType = Document<unknown, {}, VerificationCodes> & VerificationCodes;

/**
 * - Handles sending emails via SendGrid and SMS via Twilio.
 * - Uses environment variables for Twilio and SendGrid API keys, and other configurations.
 */
@Injectable()
export class MessagingService {
  private logger: Logger;
  private twilioClient: twilio.Twilio;
  private verificationLink: string;
  private sendGridEmail: string;
  private twilioPhoneNumber: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = twilio(
      configService.get<string>("TWILIO_ACCOUNT_SID"),
      configService.get<string>("TWILIO_AUTH_TOKEN")
    );
    this.logger = new Logger(MessagingService.name);
    sendGrid.setApiKey(configService.get<string>("SENDGRID_API_KEY"));
    this.verificationLink = `${configService.get<string>("BASE_URL")}/${configService.get<string>("GLOBAL_PREFIX")}/v${configService.get<string>("DEFAULT_VERSION")}/auth/verify/`;
    this.sendGridEmail = configService.get<string>("SENDGRID_FROM_EMAIL");
    this.twilioPhoneNumber = configService.get<string>("TWILIO_PHONE_NUMBER");
  }

  /**
   * send - Sends an email or SMS based on the code type.
   * @param code - The code document in the database.
   */
  send(code: codeDataType) {
    if(code.type === CodeType.EMAIL) return this.sendEmail(code);
    else return this.sendSMS(code);
  }

  /**
   * sendEmail - Sends an email using SendGrid.
   * @param code - The data of code required to send the Email.
   */
  private async sendEmail(code: codeDataType) {
    const mail: MailDataRequired = {
      to: code.value,
      from: this.sendGridEmail,
      subject: code.purpose,
      html: this.generateEmailHtmlContent(code)
    };
    try {
      await sendGrid.send(mail);
      this.logger.log("Email sent successfully to " + mail.to);
    } catch (error) {
      this.logger.error("Email send error: " + error);
    }
  }

  /**
   * sendSMS - Sends an SMS using Twilio.
   * @param codeData - The data of code required to send the SMS.
   */
  private async sendSMS(codeData: codeDataType) {
    try {
      await this.twilioClient.messages.create({
        body: this.generatePhoneVerificationLinkMessage(codeData._id.toString()),
        from: this.twilioPhoneNumber,
        to: codeData.value
      });
      this.logger.log("SMS sent successfully to " + codeData.value);
    } catch (error) {
      this.logger.error("SMS send error: " + error);
    }
  }

  /**
   * generateHtmlContent - Generates an HTML template for the email.
   * @param codeData - The code document in the database..
   * @returns {string} - HTML content.
   */
  private generateEmailHtmlContent(codeData: codeDataType): string {
    if (codeData.purpose === CodePurpose.RESET_PASSWORD) {
      return this.generateEmailVerificationCodeHtml(codeData.code);
    } else {
      return this.generateEmailVerificationLinkHtml(codeData._id.toString());
    }
  }

  /**
   * generateVerificationLinkHtml - Generates HTML content for a verification link email.
   * @param codeId - Code ID to set in the verify link.
   * @returns {string} - HTML content.
   */
  private generateEmailVerificationLinkHtml(codeId: string): string {
    const verificationUrl = this.verificationLink + encodeURIComponent(codeId);

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
            <h1 style="color: #333;">Verify Your Email</h1>
            <p>Dear User,</p>
            <p>Thank you for signing up. Please verify your email address by clicking the button below.</p>
            <a href="${verificationUrl}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p>If the button doesn't work, copy and paste the following link into your browser:</p>
            <p><a href="${verificationUrl}" style="color: #007BFF;">${verificationUrl}</a></p>
            <p style="margin-top: 20px; color: #777;">Best regards,<br/>Senior</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * generateVerificationCodeHtml - Generates HTML content for a verification code email.
   * @param code - The code content string.
   * @returns {string} - HTML content.
   */
  private generateEmailVerificationCodeHtml(code: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
            <h1 style="color: #333;">Reset Your Password</h1>
            <p>Dear User,</p>
            <p>You have requested to reset your password. Please use the following verification code to proceed with resetting your password.</p>
            <p style="font-weight: bold; color: #555;">Your Verification Code: <span style="color: #007BFF;">${code}</span></p>
            <p>If you did not request this change, please ignore this email.</p>
            <p style="margin-top: 20px; color: #777;">Best regards,<br/>Senior</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * generatePhoneVerificationLinkMessage - Generates the SMS content for a verification link.
   * @param codeId - Code ID to set in the verify link.
   * @returns {string} - The SMS content.
   */
  private generatePhoneVerificationLinkMessage(codeId: string): string {
    const verificationUrl = this.verificationLink + encodeURIComponent(codeId);

    return `To verify your phone number, click the link: ${verificationUrl}. The link will expire in 15 minutes.`;
  }

  /**
   * generatePhoneVerificationCodeMessage - Generates the SMS content for phone verification code.
   * @param code - The code content string.
   * @returns {string} - The SMS content.
   */
  private generatePhoneVerificationCodeMessage(code: string): string {
    return `Your verification code is: ${code}. Enter this code to verify your phone number. The code will expire in 15 minutes.`;
  }
}