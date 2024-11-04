import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { RequestToResetPasswordDto } from "./dtos/request-to-reset-password.dto";
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService{
  constructor(private readonly usersService: UsersService){}

  register(createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  login(loginDto: LoginDto) {
    return loginDto;
  }

  logout(token: string) {
    return token;
  }

  requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    return requestToResetPasswordDto;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }
}