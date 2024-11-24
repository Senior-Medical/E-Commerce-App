import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { Document, Model, Types } from "mongoose";
import { User } from "./entities/users.entity";
import { CodePurpose, CodeType } from "./enums/codePurpose.enum";
import { CreateCode } from "./types/createCode.type";
import { VerificationCodes } from "./entities/verificationCodes.entity";
import { MessagingService } from '../messaging/messaging.service';
import { CreateUserType } from "./types/createUser.type";
import { FilesService } from 'src/files/files.service';
import { UpdateUsersDto } from "./dtos/updateUser.dto";
import { UpdateUserType } from "./types/updateUser.type";
import { UpdatePasswordDto } from './dtos/updatePassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    @InjectModel(VerificationCodes.name) private codesModel: Model<VerificationCodes>,
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService
  ) { }
  
  async comparePassword(password: string, hashedPassword: string) {
    const encryptionService = new EncryptionService(this.configService);
    return encryptionService.bcryptCompare(password, hashedPassword);
  }

  find(condition: any) {
    return this.usersModel.find(condition);
  }
  
  async findOne(id: string) {
    return this.usersModel.findById(id);
  }

  async create(createUsersDto: CreateUserType, avatar: Express.Multer.File) {
    let user: Document;
    try {
      if (avatar) {
        createUsersDto.avatar = avatar.filename;
        await this.filesService.saveFiles([avatar]);
      }
      user = await this.usersModel.create({ ...createUsersDto });
    }catch(e) {
      if (avatar) this.filesService.removeFiles([avatar.filename]);
      console.error(e);
      throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.createCode(CodePurpose.VERIFY_EMAIL, createUsersDto.email, CodeType.EMAIL, user);
    if(createUsersDto.phone) await this.createCode(CodePurpose.VERIFY_PHONE, createUsersDto.phone, CodeType.PHONE, user);
    
    return this.getUserObject(user);
  }
  
  async update(user: any, updateData: UpdateUsersDto, avatar: Express.Multer.File) {
    const inputData: UpdateUserType = { ...updateData };
    let message: string = "";
    
    if (inputData.email) {
      await this.createCode(CodePurpose.UPDATE_EMAIL, inputData.email, CodeType.EMAIL, user);
      inputData.emailValidated = false;
      message = "Please check your new email for verification.";
    }

    if (inputData.phone) {
      await this.createCode(CodePurpose.UPDATE_PHONE, inputData.phone, CodeType.PHONE, user);
      inputData.phoneValidated = false;
      message = "Please check your new phone for verification.";
    }

    if (inputData.phone && inputData.email) {
      message = "Please check your new email and new phone for verification.";
    }
    
    try {
      let oldImage = user.avatar;
      if (avatar) {
        inputData.avatar = avatar.filename;
        await this.filesService.saveFiles([avatar]);
      }
      await user.set(inputData).save();
      if(oldImage && avatar) this.filesService.removeFiles([oldImage]);
    }catch(e) {
      if (avatar) this.filesService.removeFiles([avatar.filename]);
      throw new HttpException("Error in saving data: " + e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    message = "User updated successfully. " + message;

    return {
      message,
      user: this.getUserObject(user)
    };
  }

  async updatePassword(user: any, body: UpdatePasswordDto) {
    const { oldPassword, newPassword } = body;
    const isPasswordMatch = await this.comparePassword(oldPassword, user.password);
    if (!isPasswordMatch) throw new NotAcceptableException("Incorrect old password.");
    user.password = newPassword;
    await user.save();
    return "Password updated successfully.";
  }

  async remove(user: any) {
    await user.deleteOne();
    if (user.avatar) this.filesService.removeFiles([user.avatar]);
    return;
  }

  getUserObject(user: Document) { 
    const { password, __v, changePasswordAt, ...userObject } = user.toObject();
    return userObject;
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
      const message = (purpose === CodePurpose.VERIFY_EMAIL || purpose === CodePurpose.UPDATE_EMAIL) ? `Please visit this link to verify your email: ${baseUrl}/auth/verify/${code._id}` : `The code for reset the password is: ${code.code}.`;
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