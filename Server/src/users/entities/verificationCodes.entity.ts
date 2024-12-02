import { ConfigService } from '@nestjs/config';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { EncryptionService } from '../../utils/encryption/encryption.service';
import { CodePurpose, CodeType } from "../enums/code.enum";
import { Document } from 'mongoose';

/**
 * Represents the structure of the VerificationCodes document in the MongoDB database.
 * Represents a Verification Code used for email or phone validation.
 * Includes properties for expiration, purpose, and associated user.
 */
@Schema({ timestamps: true })
export class VerificationCodes {  
  @Prop({
    required: true,
    unique: true,
  })
  code: string;

  @Prop()
  expireAt?: Date;

  @Prop({
    required: true,
    enum: CodeType
  })
  type: CodeType;

  @Prop({
    required: true,
    unique: true,
    index: true
  })
  value: string;

  @Prop({
    required: true,
    enum: CodePurpose,
    index: true
  })
  purpose: CodePurpose;

  @Prop({
    required: true,
    ref: "User"
  })
  user: Types.ObjectId;
}

/**
 * Creates the Mongoose schema for the VerificationCodes entity.
 * - Configures automatic expiration for codes.
 * - Includes encryption for the `code` property.
 * @param configService - NestJS ConfigService for accessing environment variables.
 * @param encryptionService - EncryptionService for handling encryption and decryption.
 * @returns VerificationCodesSchema - Mongoose schema for the VerificationCodes entity.
 */
export const getVerificationCodesSchema = (configService: ConfigService, encryptionService: EncryptionService) => {
  const VerificationCodesSchema = SchemaFactory.createForClass(VerificationCodes);

  const EXPIRATION_TIME = parseInt(configService.get<string>("EXPIRE_TIME_FOR_CODES") || "900000", 10);
  VerificationCodesSchema.path('expireAt').default(() => new Date(Date.now() + EXPIRATION_TIME));

  /**
   * Automatically deletes expired documents based on the `expireAt` field.
   */
  VerificationCodesSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
  
  VerificationCodesSchema.pre('save', function (next) {
    this.code = encryptionService.encrypt(this.code);
    next();
  });
  
  VerificationCodesSchema.post(['find', 'findOne', 'save'], function (docs) {
    if (Array.isArray(docs)) docs = docs[0];
    if (docs) docs.code = encryptionService.decrypt(docs.code);
  });

  return VerificationCodesSchema;
};

export type VerificationCodesDocument = Document & VerificationCodes;