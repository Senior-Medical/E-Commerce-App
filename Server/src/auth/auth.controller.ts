import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors, Headers } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { ProfileImagesValidationPipe } from "src/users/pipes/profileImageValidation.pipe";
import { UserValidationPipe } from "src/users/pipes/userValidation.pipe";
import { AuthService } from './auth.service';
import { Public } from "./decorators/public.decorator";
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { CheckEmailExistPipe } from "./pipes/checkEmailExist.pipe";
import { CodeIdVerificationPipe } from "./pipes/codeIdVerification.pipe";
import { ResetPasswordPipe } from "./pipes/resetPassword.pipe";
import { UserIdValidationPipe } from "src/users/pipes/userIdValidation.pipe";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Get("verify/:codeId")
  @Public()
  verify(@Param("codeId", ObjectIdPipe, CodeIdVerificationPipe) code: Document) {
    return this.authService.verify(code);
  }

  @Get("resendVerification/:userId")
  @Public()
  resendVerification(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.authService.resendVerification(user);
  }

  @Get("refreshToken")
  @Public()
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Headers("Authorization") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers("Authorization") accessToken: string) {
    await this.authService.logout(accessToken);
  }

  @Post("register")
  @UseInterceptors(FileInterceptor("avatar"))
  @Public()
  register(
    @Body(UserValidationPipe) registerDto: CreateUsersDto,
    @UploadedFile(ProfileImagesValidationPipe) avatar: Express.Multer.File
  ) {
    return this.authService.register(registerDto, avatar);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  login(@UserDecorator() user: Document) {
    return this.authService.login(user);
  }

  @Post("resetPassword")
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  requestToResetPassword(@Body(CheckEmailExistPipe) requestToResetPasswordDto: RequestToResetPasswordDto) {
    return this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  @Patch("resetPassword")
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  resetPassword(@Body(ResetPasswordPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}