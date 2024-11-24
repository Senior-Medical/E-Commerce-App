import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { UsersService } from '../users/users.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { Document } from "mongoose";
import { CodePurpose, CodeType } from "src/users/enums/codePurpose.enum";
import { CreateUserType } from "src/users/types/createUser.type";
import { UpdateUserType } from "src/users/types/updateUser.type";

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
    
    const user = users[0];
    if (!user) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);
    if (!user.verified) throw new HttpException("User not verified.", HttpStatus.FORBIDDEN);

    const match = await this.usersService.comparePassword(password, user.password);
    if (!match) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);

    return user;
  }

  async register(createUsersDto: CreateUsersDto, avatar: Express.Multer.File) {
    const createData: CreateUserType = {...createUsersDto, emailValidated: false};
    let message = "User created successfully please check your email for verification."
    if (createData.phone) {
      message = message.replace("email", "email and phone");
      createData['phoneValidated'] = false;
    }
    await this.usersService.create(createData, avatar);
    return message;
  }

  async login(user: Document) {
    user.set({ lastLogin: new Date() }).save();
    return {
      access_token: this.jwtService.sign({ sub: user._id }),
      user: this.usersService.getUserObject(user)
    };
  }

  async verify(code: any) {
    const updateData: UpdateUserType = {};
    const user = await this.usersService.findOne(code.user.toString());
    
    let message = "Account verified successfully you can now login.";

    if (code.type === CodeType.EMAIL) {
      if (code.purpose === CodePurpose.UPDATE_EMAIL) {
        updateData.email = code.value;
        message = "Email updated successfully.";
      }
      updateData.emailValidated = true;
    }
    else {
      if (code.purpose === CodePurpose.UPDATE_PHONE) {
        updateData.phone = code.value;
        message = "Phone updated successfully.";
      }
      updateData.phoneValidated = true;
    }

    updateData.verified = true;
    await user.set(updateData).save();
    code.deleteOne();
    return message;
  }

  async requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    await this.usersService.createCode(CodePurpose.RESET_PASSWORD, requestToResetPasswordDto.email, CodeType.EMAIL, requestToResetPasswordDto.user);
    return `Please check your email for password reset code.`;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await resetPasswordDto.user.set({ password: resetPasswordDto.password }).save();
    await resetPasswordDto.codeData.deleteOne();
    return "Password reset successfully.";
  }
}