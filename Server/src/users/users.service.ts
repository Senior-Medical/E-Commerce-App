import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { Document, Model, Types } from "mongoose";
import { User } from "./entities/users.entity";
import { CreateUsersDto } from "./dtos/createUser.dto";
import { CodePurpose, CodeType } from "./enums/codePurpose.enum";
import { CreateCode } from "./types/createCode.type";
import { VerificationCodes } from "./entities/verificationCodes.entity";
import { MessagingService } from '../messaging/messaging.service';
import { SmsData } from "src/messaging/types/smsData.type";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    @InjectModel(VerificationCodes.name) private codesModel: Model<VerificationCodes>,
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService
  ) { }
  
  async comparePassword(password: string, hashedPassword: string) {
    const encryptionService = new EncryptionService(this.configService);
    return encryptionService.bcryptCompare(password, hashedPassword);
  }

  find(condition: any) {
    return this.usersModel.find(condition)
  }
  
  findOne(id: string) {
    return this.usersModel.findById(id);
  }

  async create(createUsersDto: CreateUsersDto) {
    const user = await this.usersModel.create({ ...createUsersDto });
    await this.createCode(CodePurpose.VERIFY_EMAIL, createUsersDto.email, CodeType.EMAIL, user);
    if(createUsersDto.phone) await this.createCode(CodePurpose.VERIFY_PHONE, createUsersDto.phone, CodeType.PHONE, user);
    return user;
  }


  
  update(user: Document, updateData: any) {
    return user.set(updateData).save();
  }

  async findCode(condition: object) {
    return this.codesModel.find(condition);
  }

  async createCode(purpose: CodePurpose, value: string, type: CodeType, user: any) {
    const codeData: CreateCode = {
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
    if (codeData.type === CodeType.EMAIL) {
      const message = (purpose === CodePurpose.VERIFY_EMAIL) ? `Please visit this link to verify your email: ${baseUrl}/auth/verify/${code._id}` : `The code for reset the password is: ${code.code}.`;
      this.messagingService.sendEmail({
        to: code.value,
        subject: purpose,
        message
      });
    } else {
      const message = `Please visit this link to verify your phone number: ${baseUrl}/auth/verify/${code._id}`;
      this.messagingService.sendSMS({
        message,
        to: code.value 
      });
    }
    return code;
  }

  async removeCode(condition: any) {
    return this.codesModel.deleteOne(condition);
  }

  private generateCode(length: number = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }
}