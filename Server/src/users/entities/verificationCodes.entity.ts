import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ConfigService } from '@nestjs/config';
import { CodePurpose, CodeType } from "../enums/codePurpose.enum";
import { EncryptionService } from '../../common/services/encryption.service';

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

export const getVerificationCodesSchema = (configService: ConfigService) => {
  const VerificationCodesSchema = SchemaFactory.createForClass(VerificationCodes);
  const encryptionService = new EncryptionService(configService);

  const EXPIRATION_TIME = parseInt(configService.get<string>("EXPIRE_TIME_FOR_CODES") || "900000", 10);
  VerificationCodesSchema.path('expireAt').default(() => new Date(Date.now() + EXPIRATION_TIME));

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