import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./entities/users.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUsersDto } from "./dtos/createUser.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) { }
  
  find() {
    
  }
  
  async findOne(condition: any) {
    const user = await this.usersModel.findOne(condition);
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