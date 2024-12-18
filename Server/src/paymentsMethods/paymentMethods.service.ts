import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import {
  Connection,
  Model,
  Query,
  Types
} from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Role } from "src/auth/enums/roles.enum";
import { UserDocument } from "src/users/entities/users.entity";
import { EncryptionService } from '../utils/encryption/encryption.service';
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { PaymentMethods, PaymentMethodsDocument } from "./entities/paymentMethods.entitiy";

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
    @InjectConnection() private readonly connection: Connection,
    private readonly encryptionService: EncryptionService
  ) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The payment methods model
   */
  getModel() {
    return this.paymentMethodsModel;
  }

  /**
   * Get available keys in the entity that may need in search.
   * 
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "cardType"
    ];
  }

  /**
   * Get the key that is used to save entity in the request and used to name the id in urls.
   */
  static getEntityName() {
    return PaymentMethods.name;
  }

  /**
   * Retrieves a list of payment methods based on the specified query builder.
   * 
   * @param req - The request object contain query builder.
   * @returns List of payment methods excluding the __v field.
   */
  find(req: Request & { queryBuilder: Query<PaymentMethods, PaymentMethodsDocument>, user: UserDocument }) {
    const user = req.user;
    const queryBuilder = req.queryBuilder;
    if (!queryBuilder) throw new InternalServerErrorException("Query builder not found.");
    if (user.role === Role.customer) return queryBuilder.find({ user: user._id }).select("-__v");
    else return queryBuilder.select("-__v");
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
  async create(paymentMethodData: CreatePaymentMethodsDto, user: UserDocument) {
    const paymentMethod = await this.paymentMethodsModel.findOne({
      cardNumber: this.encryptionService.encrypt(paymentMethodData.cardNumber)
    });
    if (paymentMethod) throw new ConflictException("Card Number already exist");

    const inputData: PaymentMethods = {
      ...paymentMethodData,
      user: user._id
    };

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (paymentMethodData.isDefault) {
        const defaultMethod = await this.paymentMethodsModel.findOne({
          user: user._id,
          isDefault: true
        });
        if (defaultMethod) await defaultMethod.set({ isDefault: false }).save({ session });
      }
      const paymentMethod = (await this.paymentMethodsModel.create([inputData], { session }))[0];
      
      await session.commitTransaction();
      return paymentMethod;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
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
  async update(paymentMethod: PaymentMethodsDocument, paymentMethodData: UpdatePaymentMethodsDto, user: UserDocument) {
    if (paymentMethodData.cardNumber) {
      const paymentMethodExist = await this.paymentMethodsModel.findOne({
        cardNumber: paymentMethodData.cardNumber
      });
      if (paymentMethodExist && paymentMethodExist._id.toString() !== paymentMethod._id.toString()) throw new ConflictException("Card Number already exist");
    }
    
    const inputData: Partial<PaymentMethods> = {
      ...paymentMethodData,
    };

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (paymentMethodData.isDefault) {
        const defaultMethod = await this.paymentMethodsModel.findOne({
          user: user._id,
          isDefault: true
        });
        if (defaultMethod && defaultMethod._id.toString() !== paymentMethod._id.toString()) await defaultMethod.set({ isDefault: false }).save({ session });
      }
  
      await paymentMethod.set(inputData).save({ session });
      
      await session.commitTransaction();
      return paymentMethod;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  /**
   * Deletes the specified payment method.
   * 
   * @param paymentMethod - The payment method to delete.
   * @returns The result of the deletion operation.
   */
  remove(paymentMethod: PaymentMethodsDocument) {
    return paymentMethod.deleteOne();
  }
}