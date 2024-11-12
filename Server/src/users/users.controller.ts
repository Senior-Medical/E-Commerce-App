import { Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController{
  constructor(private readonly usersService: UsersService) { }
  
  @Get()
  find() {
    return this.usersService.find({});
  }
    
  @Get(":userId")
  findOne(@Param("userId") userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(":userId")
  update() {
    return this.usersService.update();
  }

  @Patch("password/:userId")
  updatePassword() {
    return this.usersService.updatePassword();
  }

  @Patch("email/:userId")
  updateEmail() {
    return this.usersService.updateEmail();
  }

  @Patch("email/verify/:userId")
  verifyEmail() {
    return this.usersService.verifyEmail();
  }

  @Patch("phone/:userId")
  updatePhone() {
    return this.usersService.updatePhone();
  }

  @Patch("phone/verify/:userId")
  verifyPhone() {
    return this.usersService.verifyPhone();
  }

  @Delete(":userId")
  remove() {
    return this.usersService.remove();
  }

}