import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Document } from "mongoose";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { User, UserDocument } from "src/users/entities/users.entity";
import { ProfileImagesValidationPipe } from "src/users/pipes/profileImageValidation.pipe";
import { UserIdValidationPipe } from "src/users/pipes/userIdValidation.pipe";
import { UserValidationPipe } from "src/users/pipes/userValidation.pipe";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { AuthService } from './auth.service';
import { Public } from "./decorators/public.decorator";
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { CheckEmailExistPipe } from "./pipes/checkEmailExist.pipe";
import { ResetPasswordPipe } from "./pipes/resetPassword.pipe";

/**
 * AuthController defines the routes and handlers for user authentication-related actions,
 * such as registration, login, verification, token management, and password reset.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Verifies a user's email or phone using the provided verification code.
   * 
   * @param codeId - The ID of the verification code.
   * @returns - A message indicating the verification status.
   */
  @Get("verify/:codeId")
  @Public()
  verify(@Param("codeId") codeId: string) {
    return this.authService.verify(codeId);
  }

  /**
   * Resends email and/or phone verification codes to the user.
   * 
   * @param user - user document.
   * @returns - A message detailing the sent verification codes.
   */
  @Get("resendVerification/:userId")
  @Public()
  resendVerification(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: UserDocument) {
    return this.authService.resendVerification(user);
  }

  /**
   * Refreshes the user's access token using their refresh token.
   * 
   * @param refreshToken - The refresh token.
   * @returns - A new access token.
   */
  @Get("refreshToken")
  @Public()
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Headers("Authorization") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Logs the user out by delete their refresh token.
   * 
   * @param accessToken - The token form header.
   * @returns - A success message upon logout.
   */
  @Get("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers("Authorization") accessToken: string) {
    await this.authService.logout(accessToken);
  }

  /**
   * Registers a new user with the provided details and optional avatar.
   * 
   * @param registerDto - Data transfer object with user details.
   * @param avatar - Optional avatar file uploaded during registration.
   * @returns - A message confirming successful registration.
   */
  @Post("register")
  @UseInterceptors(FileInterceptor("avatar"))
  @Public()
  register(
    @Body(UserValidationPipe) registerDto: CreateUsersDto,
    @UploadedFile(ProfileImagesValidationPipe) avatar: Express.Multer.File
  ) {
    return this.authService.register(registerDto, avatar);
  }

  /**
   * Handles user login by validating credentials and returning tokens.
   * 
   * @param user - user document.
   * @returns - An object containing access and refresh tokens, along with user data.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  login(@UserDecorator() user: UserDocument) {
    return this.authService.login(user);
  }

  /**
   * Initiates a password reset process by sending a reset code to the user's email.
   * 
   * @param requestToResetPasswordDto - DTO containing the user's email.
   * @returns - A message confirming the password reset request.
   */
  @Post("resetPassword")
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  requestToResetPassword(@Body(CheckEmailExistPipe) requestToResetPasswordDto: RequestToResetPasswordDto) {
    return this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  /**
   * Resets the user's password using a provided reset code and new password.
   * 
   * @param resetPasswordDto - DTO containing the reset code and new password.
   * @returns - A message confirming the password reset.
   */
  @Patch("resetPassword")
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  resetPassword(@Body(ResetPasswordPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}