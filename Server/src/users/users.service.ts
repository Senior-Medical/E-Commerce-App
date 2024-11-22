import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { Model } from "mongoose";
import { User } from "./entities/users.entity";
import { CreateUsersDto } from "./dtos/createUser.dto";
import { CodePurpose, CodeType } from "./enums/codePurpose.enum";
import { CreateCode } from "./types/createCode.type";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
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
    await this.createCode(CodePurpose.VERIFY_EMAIL, createUsersDto.email, CodeType.EMAIL, user._id);
    if(createUsersDto.phone) await this.createCode(CodePurpose.VERIFY_PHONE, createUsersDto.phone, CodeType.PHONE, user._id);
    return user;
  }


  
  update(user: Document, updateData: any) {
    return user.set(updateData).save();
  }

  async findCode(id: string) {
    return this.codesModel.findById(id);
  }

  async createCode(purpose: CodePurpose, value: string, type: CodeType, user: Types.ObjectId) {
    const codeData: CreateCode = {
      code: this.generateCode(),
      value,
      type,
      purpose,
      user
    };

    const code = await this.codesModel.create({ ...codeData });

    if (codeData.type === CodeType.EMAIL) {
      const baseUrl = this.configService.get<string>("BASE_URL");
      this.messagingService.sendEmail({
        to: code.value,
        subject: purpose,
        message: `Please visit this link to verify your email: ${baseUrl}/auth/verify/${code._id}`
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