import { ConfigService } from "@nestjs/config";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { EncryptionService } from "../../common/services/encryption.service";
import { luhnCheck } from "../utils/luhnValidation";

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

export const createPaymentMethodsSchema = (configService: ConfigService) => {
  const PaymentMethodsSchema = SchemaFactory.createForClass(PaymentMethods);
  const encryptionService = new EncryptionService(configService);

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