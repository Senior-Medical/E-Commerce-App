import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { UsersService } from '../users/users.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { Document, Model, Types } from "mongoose";
import { CodePurpose, CodeType } from "src/users/enums/codePurpose.enum";
import { CreateUserType } from "src/users/types/createUser.type";
import { UpdateUserType } from "src/users/types/updateUser.type";
import { InjectModel } from "@nestjs/mongoose";
import { RefreshToken } from "./entities/refreshTokens.entity";
import { CreateRefreshToken } from "./types/createToken.type";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService{
  constructor(
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly configService: ConfigService,
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
    const user = await this.usersService.create(createData, avatar);

    return {
      message,
      userId: user._id
    };
  }

  async login(user: Document) {
    await user.set({ lastLogin: new Date() }).save();
    const accessToken = this.jwtService.sign({ sub: user._id });
    const expiresIn = this.configService.get("JWT_REFRESH_EXPIRATION");
    const refreshToken = this.jwtService.sign({ sub: user._id }, { expiresIn });

    const inputData: CreateRefreshToken = {
      token: refreshToken,
      user: new Types.ObjectId(user._id.toString())
    };
    await this.refreshTokenModel.create(inputData);

    return {
      accessToken,
      refreshToken,
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
    return {message};
  }

  async refreshToken(refreshToken: any) {
    const refreshTokenData = await this.refreshTokenModel.findOne({ token: refreshToken });
    const payload = this.jwtService.verify(refreshToken);
    if (!refreshTokenData || !payload) throw new ForbiddenException("Invalid refresh token.");

    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException("Invalid refresh token.");
    if (!user.verified) throw new UnauthorizedException("User not verified.");
    if (user.changePasswordAt) {
      let changePasswordDate = user.changePasswordAt.getTime() / 1000;
      const iat = payload.iat || 0;
      if (changePasswordDate > iat) throw new UnauthorizedException("Password changed.");
    }

    const accessToken = this.jwtService.sign({ sub: user._id });
    return {
      access_token: accessToken,
    };
  }

  async requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    await this.usersService.createCode(CodePurpose.RESET_PASSWORD, requestToResetPasswordDto.email, CodeType.EMAIL, requestToResetPasswordDto.user);
    return {message: `Please check your email for password reset code.`};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await resetPasswordDto.user.set({ password: resetPasswordDto.password }).save();
    await resetPasswordDto.codeData.deleteOne();
    return {message: "Password reset successfully."};
  }

  async resendVerification(user: any) {
    const { emailValidated, phoneValidated, verified } = user;
    let message = "";
    let email = false;
    let phone = false;
    if (user.email && !emailValidated) {
      await this.usersService.createCode(CodePurpose.VERIFY_EMAIL, user.email, CodeType.EMAIL, user);
      email = true;
    }
    if (user.phone && !phoneValidated) {
      await this.usersService.createCode(CodePurpose.VERIFY_PHONE, user.phone, CodeType.PHONE, user);
      phone = true;
    }

    if (email && phone) message = "Please check your email and phone for verification.";
    else if (email) message = "Please check your email for verification.";
    else if (phone) message = "Please check your phone for verification.";
    else message = "User already verified.";
    
    return {message};
  }
}