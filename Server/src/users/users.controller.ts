import { Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { Document } from "mongoose";
import { UserIdValidationPipe } from "./pipes/userIdValidation.pipe";
import { UserPermissionGuard } from "./guards/userPermisstion.guard";
import { UpdateUsersDto } from "./dtos/updateUser.dto";
import { UserValidationPipe } from "./pipes/userValidation.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProfileImagesValidationPipe } from "./pipes/profileImageValidation.pipe";
import { UpdatePasswordDto } from "./dtos/updatePassword.dto";
import { UserDecorator } from "./decorators/user.decorator";
import { User } from "./entities/users.entity";
import { FilesService } from "src/files/files.service";

/**
 * Handles user-related operations, including CRUD and role management.
 * - Role-based access control (RBAC) implemented using `@Roles` decorator.
 * - Validates input with custom pipes and DTOs.
 * - Supports file uploads for profile images.
 */
@Controller("users")
export class UsersController{
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) { }

  /**
   * Retrieves a list of all users.
   * - Access restricted to admins and staff.
   * - Excludes sensitive fields like `password` and `__v`.
   * 
   * @returns An array of user objects without sensitive fields.
   */
  @Get()
  @Roles(Role.admin, Role.staff)
  find() {
    return this.usersService.find({}).select("-password -__v");
  }

  /**
   * Serves a user avatar.
   * 
   * @param user - The user document.
   * @returns The requested image file.
   */
  @Get("avatar")
  serveImage(@UserDecorator() user: User) {
    return this.filesService.serveFile(user.avatar);
  }

  /**
   * Retrieves a single user's details.
   * 
   * @param user - The user object retrieved after validation.
   * @returns The user object with detailed information.
   */
  @Get(":userId")
  @UseGuards(UserPermissionGuard)
  findOne(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.getUserObject(user);
  }

  /**
   * Updates user details, including optional avatar upload.
   * 
   * @param user - The user object retrieved after validation.
   * @param updateData - The new user details.
   * @param avatar - An optional profile image file.
   * @returns The updated user object with the new details.
   */
  @Patch(":userId")
  @UseGuards(UserPermissionGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  update(
    @Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document,
    @Body(UserValidationPipe) updateData: UpdateUsersDto,
    @UploadedFile(ProfileImagesValidationPipe) avatar: Express.Multer.File
  ) {
    return this.usersService.update(user, updateData, avatar);
  }

  /**
   * Updates a user's password.
   * 
   * @param user - The user object retrieved after validation.
   * @param body - Contains the old and new passwords.
   * @returns A confirmation message or the updated user object.
   */
  @Patch("password/:userId")
  @UseGuards(UserPermissionGuard)
  updatePassword(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document, @Body() body: UpdatePasswordDto) {
    return this.usersService.updatePassword(user, body);
  }

  /**
   * Updates a user's role from customer to staff or reverse.
   * 
   * @param user - The user object retrieved after validation.
   * @returns The updated user object with the new role.
   */
  @Patch("role/:userId")
  @Roles(Role.admin)
  updateRole(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.updateRole(user);
  }

  /**
   * Deletes a user.
   * 
   * @param user - The user object retrieved after validation.
   * @returns A confirmation message or the deleted user object.
   */
  @Delete(":userId")
  @UseGuards(UserPermissionGuard)
  remove(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.remove(user);
  }
}