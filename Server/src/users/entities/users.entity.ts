import { ConfigService } from '@nestjs/config';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Address } from "src/addresses/entities/addresses.entity";
import { Role } from "src/auth/enums/roles.enum";
import { PaymentMethods } from "src/paymentsMethods/entities/paymentMethods.entitiy";
import { EncryptionService } from '../../encryption/encryption.service';
import { VerificationCodes } from "./verificationCodes.entity";

/**
 * - Represents a user in the system.
 * - Stores user information such as name, email, role, and authentication details.
 * - Tracks additional user metadata like verification status, last login, and cart total.
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  
  @Prop({ index: true })
  username?: string;
  
  @Prop({ index: true })
  phone?: string;
  
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: "customer" })
  role?: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop()
  company?: string;

  @Prop({ default: false })
  verified?: boolean;

  @Prop()
  emailValidated?: boolean;
  
  @Prop()
  phoneValidated?: boolean;
  
  @Prop()
  lastLogin?: Date;

  @Prop({ default: new Date() })
  changePasswordAt?: Date;

  @Prop({ default: 0 })
  cartTotal?: number;
}

/**
 * Creates the Mongoose schema for the User entity.
 * - Includes pre-save middleware for hashing passwords.
 * - Includes post-delete middleware for cleaning related data.
 * @param configService - NestJS ConfigService for environment configuration.
 * @param encryptionService - EncryptionService for password hashing.
 * @returns UserSchema - Mongoose schema for the User entity.
 */
export const createUserSchema = (configService: ConfigService, encryptionService: EncryptionService) => {
  const UserSchema = SchemaFactory.createForClass(User);

  UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await encryptionService.bcryptHash(this.password);
      this.changePasswordAt = new Date();
      next();
    }
  })

  UserSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
      await doc.model(Address.name).deleteMany({ user: doc._id });
      await doc.model(PaymentMethods.name).deleteMany({ user: doc._id });
      await doc.model(VerificationCodes.name).deleteMany({ user: doc._id });
    }
    next();
  });
  return UserSchema;
}