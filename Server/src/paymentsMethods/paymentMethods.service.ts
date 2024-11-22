import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentMethods } from "./entities/paymentMethods.entitiy";
import { Document, Model, Types } from "mongoose";
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { CreatePaymentMethods } from "./types/createPaymentMethods.type";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { UpdatePaymentMethods } from "./types/updatePaymentMethods.type";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethods.name) private paymentMethodsModel: Model<PaymentMethods>,
    private readonly configService: ConfigService
  ) { }
  
  find(conditions: object = {}) {
    return this.paymentMethodsModel.find(conditions);
  }

  findOne(id: string) {
    return this.paymentMethodsModel.findById(id);
  }

  async create(paymentMethodData: CreatePaymentMethodsDto, user: Document) {
    const encryptionService = new EncryptionService(this.configService);
    const paymentMethod = (await this.paymentMethodsModel.find({
      cardNumber: encryptionService.encrypt(paymentMethodData.cardNumber)
    }))[0];
    if (paymentMethod) throw new NotAcceptableException("Card Number already exist");

    if (paymentMethodData.isDefault) {
      const defaultMethod = (await this.paymentMethodsModel.find({
        user: user._id,
        isDefault: true
      }))[0];
      if (defaultMethod) await defaultMethod.set({ isDefault: false }).save();
    }

    const userId = new Types.ObjectId(user._id as string);
    const inputData: CreatePaymentMethods = {
      ...paymentMethodData,
      user: userId
    };
    return this.paymentMethodsModel.create(inputData);
  }

  async update(paymentMethod: Document, paymentMethodData: UpdatePaymentMethodsDto, user: Document) {
    if (paymentMethodData.cardNumber) {
      const paymentMethodExist = (await this.paymentMethodsModel.find({
        cardNumber: paymentMethodData.cardNumber
      }))[0];
      if (paymentMethodExist && paymentMethodExist._id.toString() !== paymentMethod._id.toString()) throw new NotAcceptableException("Card Number already exist");
    }

    if (paymentMethodData.isDefault) {
      const defaultMethod = (await this.paymentMethodsModel.find({
        user: user._id,
        isDefault: true
      }))[0];
      if (defaultMethod && defaultMethod._id.toString() !== paymentMethod._id.toString()) await defaultMethod.set({ isDefault: false }).save();
    }

    const inputData: UpdatePaymentMethods = {
      ...paymentMethodData,
    };
    return paymentMethod.set(inputData).save();
  }

  remove(paymentMethod: Document) {
    return paymentMethod.deleteOne();
  }
}