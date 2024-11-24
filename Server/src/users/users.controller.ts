import { Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { Document } from "mongoose";
import { UserIdValidationPipe } from "./pipes/userIdValidation.pipe";
import { UserPermissionGuard } from "./guards/userPermisstion.guard";

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
    return user;
  }

  // @Patch(":userId")
  // update() {
  //   return this.usersService.update();
  // }

  // @Patch("password/:userId")
  // updatePassword() {
  //   return this.usersService.updatePassword();
  // }

  // @Patch("email/:userId")
  // updateEmail() {
  //   return this.usersService.updateEmail();
  // }

  // @Patch("email/verify/:userId")
  // verifyEmail() {
  //   return this.usersService.verifyEmail();
  // }

  // @Patch("phone/:userId")
  // updatePhone() {
  //   return this.usersService.updatePhone();
  // }

  // @Patch("phone/verify/:userId")
  // verifyPhone() {
  //   return this.usersService.verifyPhone();
  // }

  @Delete(":userId")
  @UseGuards(UserPermissionGuard)
  remove(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.usersService.remove(user);
  }

}