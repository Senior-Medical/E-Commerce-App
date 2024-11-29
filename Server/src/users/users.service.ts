import { Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Role } from "src/auth/enums/roles.enum";
import { FilesService } from 'src/files/files.service';
import { EncryptionService } from '../encryption/encryption.service';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { UpdateUsersDto } from "./dtos/updateUser.dto";
import { User } from "./entities/users.entity";
import { CodePurpose, CodeType } from "./enums/code.enum";
import { CodesService } from './services/codes.service';

/**
 * Service responsible for managing user operations such as creation, update, and deletion. 
 * It also handles related features like email and phone verification.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly filesService: FilesService,
    private readonly encryptionService: EncryptionService,
    private readonly codesService: CodesService,
  ) { }

  /**
   * Removes sensitive fields from a user object.
   * 
   * @param user - The user document.
   * @returns A sanitized user object.
   */
  getUserObject(user: Document) { 
    const { password, __v, changePasswordAt, ...userObject } = user.toObject();
    return userObject;
  }

  /**
   * Finds users based on a condition.
   * 
   * @param condition - The query condition.
   * @returns An array of matching users.
   */
  find(condition: object = {}) {
    return this.usersModel.find(condition);
  }
  
  /**
   * Finds a user by ID.
   * 
   * @param id - The user ID.
   * @returns The found user or null.
   */
  async findOne(id: string) {
    return this.usersModel.findById(id);
  }

  /**
   * Creates a new user and sends verification codes for email and phone.
   * 
   * @param createUsersDto - The user data for creation.
   * @param avatar - An optional avatar file.
   * @returns The created user object without sensitive fields.
   */
  async create(createUsersDto: User, avatar: Express.Multer.File) {
    let user: Document;
    try {
      if (avatar) {
        createUsersDto.avatar = avatar.filename;
        await this.filesService.saveFiles([avatar]);
      }
      user = await this.usersModel.create({ ...createUsersDto });
    }catch(e) {
      if (avatar) this.filesService.removeFiles([avatar.filename]);
      throw e;
    }

    await this.codesService.createCode(CodePurpose.VERIFY_EMAIL, createUsersDto.email, CodeType.EMAIL, user);
    if(createUsersDto.phone) await this.codesService.createCode(CodePurpose.VERIFY_PHONE, createUsersDto.phone, CodeType.PHONE, user);
    
    return this.getUserObject(user);
  }
  
  /**
   * Updates user details, including email and phone changes, and saves a new avatar if provided.
   * It also triggers sending verification codes for updated email and phone.
   * 
   * @param user - The user object to update.
   * @param updateData - The new data to update the user with.
   * @param avatar - The new avatar file (optional).
   * @returns An object containing a success message and the updated user details.
   */
  async update(user: any, updateData: UpdateUsersDto, avatar: Express.Multer.File) {
    const inputData: Partial<User> = { ...updateData };
    let message: string = "";
    
    if (inputData.email) {
      await this.codesService.createCode(CodePurpose.UPDATE_EMAIL, inputData.email, CodeType.EMAIL, user);
      inputData.emailValidated = false;
      message = "Please check your new email for verification.";
    }

    if (inputData.phone) {
      await this.codesService.createCode(CodePurpose.UPDATE_PHONE, inputData.phone, CodeType.PHONE, user);
      inputData.phoneValidated = false;
      message = "Please check your new phone for verification.";
    }

    if (inputData.phone && inputData.email) message = "Please check your new email and new phone for verification.";
    
    try {
      let oldImage = user.avatar;
      if (avatar) {
        inputData.avatar = avatar.filename;
        await this.filesService.saveFiles([avatar]);
      }
      await user.set(inputData).save();
      if(oldImage && avatar) this.filesService.removeFiles([oldImage]);
    }catch(e) {
      if (avatar) this.filesService.removeFiles([avatar.filename]);
      throw e;
    }

    message = "User updated successfully. " + message;

    return {
      message,
      user: this.getUserObject(user)
    };
  }

  /**
   * Updates a user's password by verifying the old password and setting a new one.
   * 
   * @param user - The user object whose password is being updated.
   * @param body - The DTO containing the old and new passwords.
   * @returns A success message indicating the password has been updated.
   * @throws "NotAcceptableException" If the old password is incorrect.
   */
  async updatePassword(user: any, body: UpdatePasswordDto) {
    const { oldPassword, newPassword } = body;
    const match = await this.encryptionService.bcryptCompare(oldPassword, user.password);
    if (!match) throw new NotAcceptableException("Incorrect old password.");
    user.password = newPassword;
    await user.save();
    return "Password updated successfully.";
  }

  /**
   * Updates the user's role. The role can be toggled between `admin`, `staff`, and `customer`.
   * 
   * @param user - The user object whose role is being updated.
   * @returns The updated user object.
   * @throws "UnauthorizedException" If the user has an admin role, since admins cannot be downgraded by non-admin users.
   */
  updateRole(user: any) {
    if (user.role === Role.admin) throw new UnauthorizedException("Permission Denied.");
    else if (user.role === Role.staff) user.role = Role.customer;
    else user.role = Role.staff;
    return user.save();
  }

  /**
   * Deletes a user from the database and removes their avatar if it exists.
   * 
   * @param user - The user object to be deleted.
   * @returns Resolves once the user has been deleted.
   */
  async remove(user: any) {
    await this.usersModel.findByIdAndDelete(user._id);
    if (user.avatar) this.filesService.removeFiles([user.avatar]);
    return;
  }
}