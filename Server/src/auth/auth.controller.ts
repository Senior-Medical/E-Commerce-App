import { Body, Controller, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { AuthService } from './auth.service';
import { RequestToResetPasswordDto } from "./dtos/request-to-reset-password.dto";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { CreateUserValidationPipe } from "src/users/pipes/createUserValidation.pipe";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post("register")
  register(@Body(CreateUserValidationPipe) registerDto: CreateUsersDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get("logout")
  // logout(@Request() req) {
  //   return "logout..!";
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