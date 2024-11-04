import { Body, Controller, Get, Headers, Patch, Post, ValidationPipe } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { AuthService } from './auth.service';
import { RequestToResetPasswordDto } from "./dtos/request-to-reset-password.dto";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { CreateUserValidationPipe } from "src/users/pipes/createUserValidation.pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post("register")
  register(@Body(CreateUserValidationPipe) registerDto: CreateUsersDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("logout")
  logout(@Headers("x-auth-token") token: string) {
    return this.authService.logout(token);
  }

  @Post("resetPassword")
  requestToResetPassword(@Body() requestToResetPasswordDto: RequestToResetPasswordDto) {
    return this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  @Patch("resetPassword")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}