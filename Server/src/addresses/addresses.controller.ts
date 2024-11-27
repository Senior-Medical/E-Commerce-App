import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { AddressPermissionGuard } from "./guards/addressPermission.guard";
import { AddressIdPipe } from "./pipes/addressIdValidation.pipe";
import { Role } from "src/auth/enums/roles.enum";
import { UserIdValidationPipe } from "src/users/pipes/userIdValidation.pipe";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller("addresses")
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService
  ) { }

  @Get()
  find(@UserDecorator() user: any) {
    let condition = {};
    if(user.role === Role.customer) condition = { user: user._id };
    return this.addressesService.find(condition).populate("user", "name username");
  }

  @Get(":addressId")
  @UseGuards(AddressPermissionGuard)
  findOne(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    return address.populate("user", "name username");
  }

  @Get("user/:userId")
  @Roles(Role.admin, Role.staff)
  findByUser(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.addressesService.find({ user: user._id }).populate("user", "name username");
  }

  @Post()
  create(@Body() addressData: CreateAddressDto, @UserDecorator() user: Document) {
    return this.addressesService.create(addressData, user);
  }

  @Patch(":addressId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AddressPermissionGuard)
  update(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document, @Body() addressData: UpdateAddressDto) {
    return this.addressesService.update(address, addressData);
  }

  @Delete(":addressId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AddressPermissionGuard)
  async remove(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    await this.addressesService.remove(address);
  }
}