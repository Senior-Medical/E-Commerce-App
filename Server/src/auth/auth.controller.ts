import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { CheckEmailExistPipe } from "./pipes/checkEmailExist.pipe";
import { ResetPasswordPipe } from "./pipes/resetPassword.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProfileImagesValidationPipe } from "src/users/pipes/profileImageValidation.pipe";

@Controller("auth")
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post("register")
  @UseInterceptors(FileInterceptor("avatar"))
  register(
    @Body(CreateUserValidationPipe) registerDto: CreateUsersDto,
    @UploadedFile(ProfileImagesValidationPipe) avatar: Express.Multer.File
  ) {
    return this.authService.register(registerDto, avatar);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  login(@UserDecorator() user: Document) {
    return this.authService.login(user);
  }

  @Get("verify/:codeId")
  verify(@Param("codeId", ObjectIdPipe, CodeIdVerificationPipe) code: Document) {
    return this.authService.verify(code);
  }

  @Post("resetPassword")
  requestToResetPassword(@Body(CheckEmailExistPipe) requestToResetPasswordDto: RequestToResetPasswordDto) {
    return this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  @Patch("resetPassword")
  @HttpCode(HttpStatus.ACCEPTED)
  resetPassword(@Body(ResetPasswordPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}