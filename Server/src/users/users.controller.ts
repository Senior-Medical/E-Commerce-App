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

@Controller("users")
export class UsersController{
  constructor(private readonly usersService: UsersService) { }
  
  @Get()
  @Roles(Role.admin, Role.staff)
  find() {
    return this.usersService.find({}).select("-password -__v");
  }

  @Get(":userId")
  @UseGuards(UserPermissionGuard)
  findOne(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.getUserObject(user);
  }

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

  // @Patch("password/:userId")
  // updatePassword() {
  //   return this.usersService.updatePassword();
  // }

  @Delete(":userId")
  @UseGuards(UserPermissionGuard)
  remove(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.remove(user);
  }

}