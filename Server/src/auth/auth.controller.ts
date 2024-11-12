import { Body, Controller, Get, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { CreateUserValidationPipe } from "src/users/pipes/createUserValidation.pipe";
import { AuthService } from './auth.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post("register")
  register(@Body(CreateUserValidationPipe) registerDto: CreateUsersDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@UserDecorator() user) {
    return this.authService.login(user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get("logout")
  // logout(@Request() req) {
  //   return req.user;
  // }

  @Post("resetPassword")
  requestToResetPassword(@Body() requestToResetPasswordDto: RequestToResetPasswordDto) {
    return this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  @Patch("resetPassword")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}