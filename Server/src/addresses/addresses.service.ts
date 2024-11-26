import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address } from "./entities/addresses.entity";
import { Document, Model, Types } from "mongoose";
import { CreateAddressDto } from "./dtos/createAddress.dto";
import { CreateAddressType } from "./types/createAddress.type";
import { UpdateAddressDto } from "./dtos/updateAddress.dto";
import { UpdateAddressType } from "./types/updateAddress.type";

@Injectable()
export class AddressesService {
  constructor(@InjectModel(Address.name) private addressesModel: Model<Address>) { }
  
  find(conditions: object = {}) {
    return this.addressesModel.find(conditions).select("-__v");
  }

  findOne(id: string) {
    return this.addressesModel.findById(id).select("-__v");
  }

  create(addressData: CreateAddressDto, user: Document) {
    const inputData: CreateAddressType = {
      ...addressData,
      user: new Types.ObjectId(user._id as string)
    };
    return this.addressesModel.create(inputData);
  }

  update(address: Document, addressData: UpdateAddressDto) {
    const inputData: UpdateAddressType = {
      ...addressData
    };
    return address.set(inputData).save();
  }

  remove(address: Document) {
    return address.deleteOne();
  }
}