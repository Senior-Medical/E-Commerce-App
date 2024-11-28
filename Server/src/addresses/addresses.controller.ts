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

/**
 * The AddressesController handles all API requests related to user addresses.
 * Features include:
 * - Fetching addresses (all or by user)
 * - Creating, updating, and deleting addresses
 * - Role-based and permission-based access control
 */
@Controller("addresses")
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService
  ) { }

  /**
   * Retrieves all addresses.
   * 
   * - Customers see only their own addresses.
   * - Admins and staff can access all addresses.
   * 
   * @param user - The authenticated user object.
   * @returns List of addresses.
   */
  @Get()
  find(@UserDecorator() user: any) {
    let condition = {};
    if(user.role === Role.customer) condition = { user: user._id };
    return this.addressesService.find(condition).populate("user", "name username");
  }

  /**
   * Retrieves a single address by its ID.
   * - Ensures access permissions using `AddressPermissionGuard`.
   * - Populates associated user details.
   * @param address - The validated and authorized address document.
   * @returns Address details.
   */
  @Get(":addressId")
  @UseGuards(AddressPermissionGuard)
  findOne(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    return address.populate("user", "name username");
  }

  /**
   * Retrieves addresses for a specific user.
   * - Restricted to admin and staff roles using `Roles` decorator.
   * @param user - The validated user document.
   * @returns Addresses belonging to the specified user.
   */
  @Get("user/:userId")
  @Roles(Role.admin, Role.staff)
  findByUser(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.addressesService.find({ user: user._id }).populate("user", "name username");
  }

  /**
   * Creates a new address for the authenticated user.
   * - Validates the input DTO.
   * - Associates the address with the current user.
   * @param addressData - DTO containing address details.
   * @param user - The authenticated user document.
   * @returns The created address.
   */
  @Post()
  create(@Body() addressData: CreateAddressDto, @UserDecorator() user: Document) {
    return this.addressesService.create(addressData, user);
  }

  /**
   * Updates an existing address.
   * - Ensures access permissions using `AddressPermissionGuard`.
   * - Validates the input DTO and updates the address.
   * @param address - The validated address document.
   * @param addressData - DTO containing updated address details.
   * @returns The updated address.
   */
  @Patch(":addressId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AddressPermissionGuard)
  update(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document, @Body() addressData: UpdateAddressDto) {
    return this.addressesService.update(address, addressData);
  }

  /**
   * Deletes a address by its ID.
   * - Ensures access permissions using `AddressPermissionGuard`.
   * - Removes the address from the database.
   * @param address - The validated address document.
   */
  @Delete(":addressId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AddressPermissionGuard)
  async remove(@Param("addressId", ObjectIdPipe, AddressIdPipe) address: Document) {
    await this.addressesService.remove(address);
  }
}