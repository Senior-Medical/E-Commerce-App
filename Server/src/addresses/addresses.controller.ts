import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Request } from "express";
import { Query } from "mongoose";
import { UserDocument } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { Address, AddressDocument } from "./entities/addresses.entity";
import { AddressPermissionGuard } from "./guards/addressPermission.guard";
import { GetObjectFromRequestDecorator } from "src/utils/shared/decorators/getObjectFromRequest.decorator";

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
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { user: UserDocument, queryBuilder: Query<Address, AddressDocument> }) {
    return this.addressesService.find(req).populate("user", "name username");
  }

  /**
   * Retrieves a single address by its ID.
   * - Ensures access permissions using `AddressPermissionGuard`.
   * - Populates associated user details.
   * @param address - The validated and authorized address document.
   * @returns Address details.
   */
  @Get(`:${AddressesService.getEntityName()}Id`)
  @UseGuards(AddressPermissionGuard)
  findOne(@GetObjectFromRequestDecorator(AddressesService.getEntityName()) address: AddressDocument) {
    return address.populate("user", "name username");
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
  create(
    @Body() addressData: CreateAddressDto,
    @GetObjectFromRequestDecorator('user') user: UserDocument
  ) {
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
  @Patch(`:${AddressesService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AddressPermissionGuard)
  update(
    @GetObjectFromRequestDecorator(AddressesService.getEntityName()) address: AddressDocument,
    @Body() addressData: UpdateAddressDto
  ) {
    return this.addressesService.update(address, addressData);
  }

  /**
   * Deletes a address by its ID.
   * - Ensures access permissions using `AddressPermissionGuard`.
   * - Removes the address from the database.
   * @param address - The validated address document.
   */
  @Delete(`:${AddressesService.getEntityName()}Id`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AddressPermissionGuard)
  async remove(@GetObjectFromRequestDecorator(AddressesService.getEntityName()) address: AddressDocument) {
    await this.addressesService.remove(address);
  }
}