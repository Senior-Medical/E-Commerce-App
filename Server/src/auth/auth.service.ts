import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { RequestToResetPasswordDto } from "./dtos/request-to-reset-password.dto";
import { UsersService } from '../users/users.service';
// import DeviceDetector from "device-detector-js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
  // private detector = new DeviceDetector();
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }
  
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({
      $or: [
        {username: email},
        {email: email},
        {phone: email}
      ]
    });
    if (!user) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);

    if (!user.verified) throw new HttpException("User not verified.", HttpStatus.FORBIDDEN);

    const match = await this.usersService.comparePassword(password, user.password);
    if (!match) throw new HttpException("Incorrect email or password.", HttpStatus.FORBIDDEN);

    return user;
  }

  async register(createUsersDto: CreateUsersDto) {
    const user = await this.usersService.create(createUsersDto);
    return this.login(user);
  }

  async login(user: any) {
    const { password, __v, ...userData } = user.toObject();
    return {
      access_token: this.jwtService.sign({ sub: user._id }),
      user: userData
    };
  }

  // logout(token: string) {
  //   return token;
  // }

  requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    return requestToResetPasswordDto;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }
}