import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { UsersService } from '../users/users.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { Document } from "mongoose";
import { VerificationCodes } from "src/users/entities/verificationCodes.entity";
import { CodeType } from "src/users/enums/codePurpose.enum";
import { CreateUserType } from "src/users/types/createUser.type";

@Injectable()
export class AuthService{
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
  
  async validateUser(email: string, password: string) {
    const users = await this.usersService.find({
      $or: [
        {username: email},
        {email: email},
        {phone: email}
      ]
    });
    if (users.length === 0) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);

    const user = users[0];
    if (!user.verified) throw new HttpException("User not verified.", HttpStatus.FORBIDDEN);

    const match = await this.usersService.comparePassword(password, user.password);
    if (!match) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);

    return user;
  }

  async register(createUsersDto: CreateUsersDto) {
    const createData: CreateUserType = {...createUsersDto, emailValidated: false};
    let message = "User created successfully please check your email for verification.";
    if (createData.phone) {
      message = message.replace("email", "email and phone");
      createData['phoneValidated'] = false;
    }
    const user = await this.usersService.create(createData);
    return {message}
  }

  async login(user: any) {
    const { password, __v, ...userData } = user.toObject();
    return {
      access_token: this.jwtService.sign({ sub: user._id }),
      user: userData
    };
  }

  async verify(code: any) {
    const updateData = {};
    let message = "";
    const user = await this.usersService.findOne(code.user.toString());

    if (code.type === CodeType.EMAIL) {
      if (user.phoneValidated === false) {
        updateData["emailValidated"] = true;
        message = "Email verified successfully. Please verify your phone number.";
      } else {
        updateData["emailValidated"] = true;
        updateData["verified"] = true;
        message = "User verified successfully you can now login.";
      }
    } else {
      if (user.emailValidated === false) {
        updateData["phoneValidated"] = true;
        message = "Phone verified successfully. Please verify your email.";
      } else {
        updateData["phoneValidated"] = true;
        updateData["verified"] = true;
        message = "User verified successfully you can now login.";
      }
    }
    await user.set(updateData).save();
    return message;
  }

  requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    return requestToResetPasswordDto;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }
}