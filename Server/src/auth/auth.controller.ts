import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { CreateUserValidationPipe } from "src/users/pipes/createUserValidation.pipe";
import { AuthService } from './auth.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { Public } from "./decorators/public.decorator";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { CodeIdVerificationPipe } from "./pipes/codeIdVerification.pipe";
import { Document } from "mongoose";

@Controller("auth")
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post("register")
  register(@Body(CreateUserValidationPipe) registerDto: CreateUsersDto) {
    return this.authService.register(registerDto);
  }

  // @Post("verifyEmail")
  // verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  //   return this.authService.verifyEmail(verifyEmailDto);
  // }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  login(@UserDecorator() user: any) {
    return this.authService.login(user);
  }

  @Get("verify/:codeId")
  verify(@Param("codeId", ObjectIdPipe, CodeIdVerificationPipe) code: Document) {
    return this.authService.verify(code);
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