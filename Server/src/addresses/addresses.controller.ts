import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { CheckAddressOwnerGuard } from "./guards/checkAddressOwner.guard";
import { AddressIdPipe } from "./pipes/addressIdValidation.pipe";
import { UsersService } from 'src/users/users.service';

@Controller("addresses")
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService
  ) { }

  @Get()
  find(@UserDecorator() user: Document) {
    return this.addressesService.find({ user: user._id }).populate("user", "name username");
  }

  @Get(":addressId")
  findOne(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    return address.populate("user", "name username");
  }

  @Post()
  create(@Body() addressData: CreateAddressDto, @UserDecorator() user: Document) {
    return this.addressesService.create(addressData, user);
  }

  @Patch(":addressId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(CheckAddressOwnerGuard)
  update(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document, @Body() addressData: UpdateAddressDto) {
    return this.addressesService.update(address, addressData);
  }

  @Delete(":addressId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckAddressOwnerGuard)
  remove(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    return this.addressesService.remove(address);
  }
}