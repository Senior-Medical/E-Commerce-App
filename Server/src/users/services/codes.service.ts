import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { ConfigService } from '@nestjs/config';
import { MessagingService } from '../../messaging/messaging.service';
import { VerificationCodes } from "../entities/verificationCodes.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CodePurpose, CodeType } from "../enums/code.enum";

/**
 * Service responsible for managing verification codes used for user authentication 
 * and validation processes such as email or phone verification.
 */
@Injectable()
export class CodesService {
  constructor(
    @InjectModel(VerificationCodes.name) private codesModel: Model<VerificationCodes>,
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Finds a verification code based on a condition.
   * 
   * @param condition - The query condition to match the code.
   * @returns The found code or null.
   */
  async findCode(condition: object) {
    return this.codesModel.findOne(condition);
  }

  /**
   * Creates a new verification code and sends it via email or SMS based on the code type.
   * 
   * @param purpose - The purpose of the code (e.g., VERIFY_EMAIL).
   * @param value - The email or phone number to verify.
   * @param type - The type of the code (EMAIL or PHONE).
   * @param user - The user object to associate with the code.
   * @returns The created verification code document.
   */
  async createCode(purpose: CodePurpose, value: string, type: CodeType, user: any) {
    const codeData: VerificationCodes = {
      code: this.generateCode(),
      value,
      type,
      purpose,
      user: user._id
    };

    const existingCode = await this.codesModel.findOne({ value });
    if(existingCode) await existingCode.deleteOne();

    const code = await this.codesModel.create({ ...codeData });
    const baseUrl = this.configService.get<string>("BASE_URL");
    const message = this.getMessageForCode(baseUrl, code, purpose);
    
    if (code.type === CodeType.EMAIL) this.messagingService.sendEmail({
      to: code.value,
      subject: purpose,
      message
    });
    else this.messagingService.sendSMS({
      message,
      to: code.value 
    });

    return code;
  }

  /**
   * Generates a random alphanumeric code.
   * 
   * @param length - The length of the code and have default value (6).
   * @returns The generated code.
   */
  private generateCode(length: number = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  /**
   * Generates a message for the verification code based on its type and purpose.
   * 
   * @param baseUrl - The base URL of the application.
   * @param code - The verification code document.
   * @param purpose - The purpose of the code.
   * @returns The generated message.
   */
  private getMessageForCode(baseUrl: string, code: any, purpose: CodePurpose): string {
    if (code.type === CodeType.EMAIL) {
      if (purpose === CodePurpose.VERIFY_EMAIL || purpose === CodePurpose.UPDATE_EMAIL) return `Please visit this link to verify your email: ${baseUrl}/auth/verify/${code._id}`
      else return `The code for resetting the password is: ${code.code}.`;
    } else return `Please visit this link to verify your phone number: ${baseUrl}/auth/verify/${code._id}`;
  }
}