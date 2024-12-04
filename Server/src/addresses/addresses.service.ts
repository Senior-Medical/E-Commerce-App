import {
  Model,
  Query,
  Types
} from "mongoose";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address, AddressDocument } from "./entities/addresses.entity";
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { Role } from "src/auth/enums/roles.enum";
import { Request } from "express";
import { UserDocument } from "src/users/entities/users.entity";

/**
 * The AddressesService contains the business logic for managing user addresses.
 * It provides methods to:
 * - Find addresses based on filters
 * - Find a specific address by ID
 * - Create, update, and delete addresses
 */
@Injectable()
export class AddressesService {
  constructor(@InjectModel(Address.name) private addressesModel: Model<Address>) { }
  
  /**
   * Get model of this service to use it in api feature module
   * @returns - The addresses model
   */
  getModel() {
    return this.addressesModel;
  }

  /**
   * Get available keys in the entity that may need in search.
   * 
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "title",
      "addressLine",
      "country",
      "city",
      "state",
      "postalCode",
      "landmark"
    ]
  }

  /**
   * Get the key that is used to save entity in the request and used to name the id in urls.
   */
  static getEntityName() {
    return Address.name;
  }

  /**
   * Retrieves addresses based on specified query parameter.
   * @param req - Request object containing the query builder and user
   * @returns A list of addresses excluding the `__v` field
   */
  find(req: Request & { queryBuilder: Query<Address, AddressDocument>, user: UserDocument }) {
    const user = req.user;
    const queryBuilder = req.queryBuilder;
    if (!queryBuilder) throw new InternalServerErrorException("Query builder not found.");
    if(user.role === Role.customer) return queryBuilder.find({ user: user._id }).select("-__v");
    else return queryBuilder.select("-__v");
  }

  /**
   * Finds a single address by its unique ID.
   * @param id - The ID of the address
   * @returns The address document excluding the `__v` field
   */
  findOne(id: string) {
    return this.addressesModel.findById(id).select("-__v");
  }

  /**
   * Creates a new address for a user.
   * @param addressData - Data for the new address
   * @param user - The user document to associate the address with
   * @returns The newly created address document
   */
  create(addressData: CreateAddressDto, user: UserDocument) {
    const inputData: Address = {
      ...addressData,
      user: user._id // Converts the user ID to a valid MongoDB ObjectId
    };
    return this.addressesModel.create(inputData);
  }

  /**
   * Updates an existing address with new data.
   * @param address - The existing address document to update
   * @param addressData - The new data for the address
   * @returns The updated address document
   */
  update(address: AddressDocument, addressData: UpdateAddressDto) {
    const inputData: Partial<Address> = {
      ...addressData
    };
    return address.set(inputData).save();
  }

  /**
   * Deletes an address document from the database.
   * @param address - The address document to delete
   * @returns The result of the deletion operation
   */
  remove(address: AddressDocument) {
    return address.deleteOne();
  }
}