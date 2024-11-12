import { Injectable } from "@nestjs/common";
import { Model, Query } from "mongoose";
import { User } from "./entities/users.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUsersDto } from "./dtos/createUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) { }
  
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
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