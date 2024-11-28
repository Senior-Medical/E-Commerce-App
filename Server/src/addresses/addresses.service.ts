import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address } from "./entities/addresses.entity";
import { Document, Model, Types } from "mongoose";
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";

/**
 * The AddressesService contains the business logic for managing user addresses.
 * It provides methods to:
 * - Find addresses based on conditions
 * - Find a specific address by ID
 * - Create, update, and delete addresses
 */
@Injectable()
export class AddressesService {
  constructor(@InjectModel(Address.name) private addressesModel: Model<Address>) { }
  
  /**
   * Retrieves addresses based on specified conditions.
   * @param conditions - Optional: Query filter for finding addresses
   * @returns A list of addresses excluding the `__v` field
   */
  find(conditions: object = {}) {
    return this.addressesModel.find(conditions).select("-__v");
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
  create(addressData: CreateAddressDto, user: Document) {
    const inputData: Address = {
      ...addressData,
      user: new Types.ObjectId(user._id as string) // Converts the user ID to a valid MongoDB ObjectId
    };
    return this.addressesModel.create(inputData);
  }

  /**
   * Updates an existing address with new data.
   * @param address - The existing address document to update
   * @param addressData - The new data for the address
   * @returns The updated address document
   */
  update(address: Document, addressData: UpdateAddressDto) {
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
  remove(address: Document) {
    return address.deleteOne();
  }
}