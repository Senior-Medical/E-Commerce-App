import { ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentMethods } from "./entities/paymentMethods.entitiy";
import { Document, Model, Types } from "mongoose";
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { EncryptionService } from '../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

/**
 * PaymentMethodsService
 *
 * Provides CRUD operations and business logic for managing payment methods.
 * Ensures data consistency, security (encryption), and user-specific permissions.
 */
@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethods.name) private paymentMethodsModel: Model<PaymentMethods>,
    private readonly configService: ConfigService
  ) { }

  /**
   * Retrieves a list of payment methods based on the specified conditions.
   * 
   * @param conditions - Optional: MongoDB query filter conditions.
   * @returns List of payment methods excluding the __v field.
   */
  find(conditions: object = {}) {
    return this.paymentMethodsModel.find(conditions).select("-__v");
  }

  /**
   * Retrieves a single payment method by its ID.
   * 
   * @param id - The ID of the payment method to retrieve.
   * @returns Payment method document excluding the __v field.
   */
  findOne(id: string) {
    return this.paymentMethodsModel.findById(id).select("-__v");
  }

  /**
   * Creates a new payment method for the specified user.
   * 
   * - Encrypts sensitive fields (e.g., card number) before saving.
   * - Ensures card number uniqueness.
   * - Updates the user's default payment method if applicable.
   * 
   * @param paymentMethodData - DTO containing payment method details.
   * @param user - The user creating the payment method.
   * @returns The created payment method.
   * @throws ConflictException if the card number already exists.
   */
  async create(paymentMethodData: CreatePaymentMethodsDto, user: Document) {
    const encryptionService = new EncryptionService(this.configService);
    const paymentMethod = await this.paymentMethodsModel.findOne({
      cardNumber: encryptionService.encrypt(paymentMethodData.cardNumber)
    });
    if (paymentMethod) throw new ConflictException("Card Number already exist");

    if (paymentMethodData.isDefault) {
      const defaultMethod = (await this.paymentMethodsModel.find({
        user: user._id,
        isDefault: true
      }))[0];
      if (defaultMethod) await defaultMethod.set({ isDefault: false }).save();
    }

    const userId = new Types.ObjectId(user._id as string);
    const inputData: PaymentMethods = {
      ...paymentMethodData,
      user: userId
    };
    return this.paymentMethodsModel.create(inputData);
  }

  /**
   * Updates an existing payment method.
   * 
   * - Validates card number uniqueness if updated.
   * - Updates the user's default payment method if applicable.
   * 
   * @param paymentMethod - The payment method to update.
   * @param paymentMethodData - DTO containing updated fields.
   * @param user - The user performing the update.
   * @returns The updated payment method.
   * @throws ConflictException if the updated card number already exists.
   */
  async update(paymentMethod: Document, paymentMethodData: UpdatePaymentMethodsDto, user: Document) {
    if (paymentMethodData.cardNumber) {
      const paymentMethodExist = (await this.paymentMethodsModel.find({
        cardNumber: paymentMethodData.cardNumber
      }))[0];
      if (paymentMethodExist && paymentMethodExist._id.toString() !== paymentMethod._id.toString()) throw new ConflictException("Card Number already exist");
    }

    if (paymentMethodData.isDefault) {
      const defaultMethod = (await this.paymentMethodsModel.find({
        user: user._id,
        isDefault: true
      }))[0];
      if (defaultMethod && defaultMethod._id.toString() !== paymentMethod._id.toString()) await defaultMethod.set({ isDefault: false }).save();
    }

    const inputData: Partial<PaymentMethods> = {
      ...paymentMethodData,
    };
    return paymentMethod.set(inputData).save();
  }

  /**
   * Deletes the specified payment method.
   * 
   * @param paymentMethod - The payment method to delete.
   * @returns The result of the deletion operation.
   */
  remove(paymentMethod: Document) {
    return paymentMethod.deleteOne();
  }
}