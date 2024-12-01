import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Document, Model, Types } from "mongoose";
import { CreateUsersDto } from "src/users/dtos/createUser.dto";
import { User } from "src/users/entities/users.entity";
import { CodePurpose, CodeType } from "src/users/enums/code.enum";
import { UsersService } from '../users/users.service';
import { RequestToResetPasswordDto } from "./dtos/requestToResetPassword.dto";
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { RefreshToken } from "./entities/refreshTokens.entity";
import { EncryptionService } from "src/encryption/encryption.service";
import { CodesService } from '../users/services/codes.service';
/**
 * AuthService handles the authentication logic for user registration, login, verification,
 * token management, and password reset.
 */
@Injectable()
export class AuthService{
  constructor(
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly codesService: CodesService
  ) { }

  /**
   * Validates the user's email and password, ensuring the user exists, is verified, 
   * and the password matches the stored hashed value.
   * 
   * @param email - The email or phone number used for login.
   * @param password - The plain-text password to compare.
   * @returns - The user object if validation is successful.
   * @throws - "ForbiddenException" if any validation fails.
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByCondition({
      $or: [
        {username: email},
        {email: email},
        {phone: email}
      ]
    });

    if (!user) throw new ForbiddenException("Incorrect email or password.");
    if (!user.verified) throw new ForbiddenException("User not verified.");

    const match = await this.encryptionService.bcryptCompare(password, user.password);

    if (!match) throw new ForbiddenException("Incorrect email or password.");

    return user;
  }

  /**
   * Registers a new user and sends an email (or phone) verification request.
   * 
   * @param createUsersDto: Data transfer object containing user details for registration.
   * @param avatar: The uploaded avatar image for the user.
   * @returns A message and the newly created user's ID.
   */
  async register(createUsersDto: CreateUsersDto, avatar: Express.Multer.File) {
    const createData: User = {...createUsersDto, emailValidated: false};
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

  /**
   * Logs the user in by generating access and refresh tokens.
   * 
   * @param user - The authenticated user document.
   * @returns - An object containing the access token, refresh token, and user details.
   */
  async login(user: Document) {
    const expiresIn = this.configService.get("JWT_REFRESH_EXPIRATION");
    const refreshToken = this.jwtService.sign({ sub: user._id }, { expiresIn });
    
    const inputData: RefreshToken = {
      token: refreshToken,
      user: new Types.ObjectId(user._id.toString())
    };

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const refreshTokenData = await this.refreshTokenModel.create([inputData], {session})[0];
      
      const accessToken = this.jwtService.sign({ sub: refreshTokenData.user, refreshTokenId: refreshTokenData._id });
      
      await user.set({ lastLogin: new Date() }).save({session});

      await session.commitTransaction();
      session.endSession();

      return {
        accessToken,
        refreshToken,
        user: this.usersService.getUserObject(user)
      };
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  /**
   * Verifies the user's email or phone, and updates their account status.
   * 
   * @param code - The verification code.
   * @returns - A success message indicating the result of the verification.
   */
  async verify(code: any) {
    const updateData: Partial<User> = {};
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

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await user.set(updateData).save({session});
      await code.deleteOne({session});
      await session.commitTransaction();
      session.endSession();
      return {message};
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  /**
   * Refreshes the access token using a provided refresh token.
   * 
   * @param refreshToken - The refresh token.
   * @returns - The new access token.
   */
  async refreshToken(refreshToken: string) {
    refreshToken = refreshToken.split(" ")[1];
    const refreshTokenData = await this.refreshTokenModel.findOne({ token: refreshToken });
    const accessToken = this.jwtService.sign({ sub: refreshTokenData.user, refreshTokenId: refreshTokenData._id });
    return { accessToken };
  }

  /**
   * Logs the user out by deleting the associated refresh token.
   * 
   * @param accessToken - The access token used for the logout process.
   */
  async logout(accessToken: string) {
    accessToken = accessToken.split(" ")[1]
    const { refreshTokenId } = this.jwtService.verify(accessToken);
    await this.refreshTokenModel.deleteOne({ _id: refreshTokenId });
  }

  /**
   * Retrieves a refresh token document based on the provided conditions.
   * 
   * @param conditions - Conditions to filter the refresh token.
   * @returns - The matching refresh token document.
   */
  findRefreshToken(conditions: object = {}) {
    return this.refreshTokenModel.findOne(conditions);
  }

  /**
   * Initiates the process for resetting the user's password by sending a reset code.
   * 
   * @param requestToResetPasswordDto - The request containing user email or phone.
   * @returns - A success message.
   */
  async requestToResetPassword(requestToResetPasswordDto: RequestToResetPasswordDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.codesService.createCode(CodePurpose.RESET_PASSWORD, requestToResetPasswordDto.email, CodeType.EMAIL, requestToResetPasswordDto.user, session);
      await session.commitTransaction();
      session.endSession();
      return {message: `Please check your email for password reset code.`};
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  /**
   * Resets the user's password after validation of the reset code.
   * 
   * @param resetPasswordDto - The data containing the new password and reset code.
   * @returns - A success message.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await resetPasswordDto.user.set({ password: resetPasswordDto.password }).save({session});
      await resetPasswordDto.codeData.deleteOne({session});
      await session.commitTransaction();
      session.endSession();
      return {message: "Password reset successfully."};
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }

  }

  /**
   * Resends verification codes for email and/or phone if they are not yet verified.
   * 
   * @param user - The user whose verification codes need to be resent.
   * @returns - A message indicating what verification codes were sent.
   */
  async resendVerification(user: any) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { emailValidated, phoneValidated } = user;
      let email = false;
      let phone = false;
      if (user.email && !emailValidated) {
        await this.codesService.createCode(CodePurpose.VERIFY_EMAIL, user.email, CodeType.EMAIL, user, session);
        email = true;
      }
      if (user.phone && !phoneValidated) {
        await this.codesService.createCode(CodePurpose.VERIFY_PHONE, user.phone, CodeType.PHONE, user, session);
        phone = true;
      }
  
      let message = "";
      if (email && phone) message = "Please check your email and phone for verification.";
      else if (email) message = "Please check your email for verification.";
      else if (phone) message = "Please check your phone for verification.";
      else message = "User already verified.";
      
      await session.commitTransaction();
      session.endSession();

      return {message};
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}