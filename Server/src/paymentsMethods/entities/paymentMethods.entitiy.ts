import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EncryptionService } from "../../utils/encryption/encryption.service";
import { luhnCheck } from "../utils/luhnValidation";

/**
 * Mongoose schema for payment methods.
 * - Validates card type, number, holder name, and expiry date.
 * - Encrypts sensitive data (card number and cardholder name) before saving to the database.
 * - Decrypts sensitive data after retrieval.
 * 
 * Key Features:
 * - Uses custom validators, including Luhn algorithm for card number validation.
 * - Ensures expiry dates are valid and in the future.
 * - Associates payment methods with a specific user.
 * - Implements hooks for encryption and decryption using `EncryptionService`.
 */
@Schema({timestamps: true})
export class PaymentMethods {
  @Prop({
    required: true,
    enum: ['Visa', 'MasterCard', 'American Express', 'Discover'],
  })
  cardType: string;

  @Prop({
    required: true,
    unique: true,
    match: /^[0-9]{13,19}$/,
    validate: {
      validator: luhnCheck
    }
  })
  cardNumber: string;

  @Prop({
    required: true,
    match: /^[a-zA-Z\s-]+$/
  })
  cardholderName: string;

  @Prop({
    required: true,
    validate: {
      validator: function (v: string) {
        const [month, year] = v.split('/').map(Number);
        const now = new Date();
        const expiry = new Date(`20${year}-${month}-01`);
        return month >= 1 && month <= 12 && expiry > now;
      },
    }
  })
  expiryDate: string;

  @Prop({default: false})
  isDefault?: boolean;

  @Prop({
    required: true,
    ref: "User"
  })
  user: Types.ObjectId;
}

export const createPaymentMethodsSchema = (encryptionService: EncryptionService) => {
  const PaymentMethodsSchema = SchemaFactory.createForClass(PaymentMethods);
  PaymentMethodsSchema.pre('save', function (next) {
    if (this.isModified('cardNumber')) this.cardNumber = encryptionService.encrypt(this.cardNumber);
    
    if (this.isModified('cardholderName')) this.cardholderName = encryptionService.encrypt(this.cardholderName);

    next();
  })

  PaymentMethodsSchema.post(['find', 'findOne', 'save'], function (docs) {
    if (docs) {
      if (Array.isArray(docs)) {
        docs.forEach(doc => {
          doc.cardNumber = encryptionService.decrypt(doc.cardNumber);
          doc.cardholderName = encryptionService.decrypt(doc.cardholderName);
        })
      } else {
        docs.cardNumber = encryptionService.decrypt(docs.cardNumber);
        docs.cardholderName = encryptionService.decrypt(docs.cardholderName);
      }
    }
  })

  return PaymentMethodsSchema;
}

export type PaymentMethodsDocument = Document<Types.ObjectId> & PaymentMethods;