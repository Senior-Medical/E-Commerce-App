import { Injectable } from "@nestjs/common";
import { Model, Query } from "mongoose";
import { User } from "./entities/users.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUsersDto } from "./dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

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
  
  async findOne(id: string) {
    const user = await this.usersModel.findById(id);
    return user;
  }

  create(createUsersDto: CreateUsersDto) {
    return this.usersModel.create({ ...createUsersDto });
  }
  
  update() {
    
  }
  
  updatePassword() {
    
  }
  
  updateEmail() {
    
  }
  
  verifyEmail() {
    
  }
  
  updatePhone() {
    
  }
  
  verifyPhone() {
    
  }
  
  remove() {
    
  }
  
}