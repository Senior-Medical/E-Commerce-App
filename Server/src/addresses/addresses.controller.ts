import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AddressesService } from './addresses.service';
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { AddressIdPipe } from "./pipes/addressIdValidation.pipe";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { Document } from "mongoose";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { CheckAddressOwnerGuard } from "./guards/checkAddressOwner.guard";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Get()
  find(@UserDecorator() user: Document) {
    return this.addressesService.find({ user: user._id });
  }

  @Get(":addressId")
  findOne(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    return address;
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