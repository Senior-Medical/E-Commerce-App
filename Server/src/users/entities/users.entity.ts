import { HttpException, HttpStatus } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/auth/enums/roles.enum";
import { EncryptionService } from '../../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { model } from 'mongoose';
import { VerificationCodes } from "./verificationCodes.entity";
import { Address } from "src/addresses/entities/addresses.entity";
import { PaymentMethods } from "src/paymentsMethods/entities/paymentMethods.entitiy";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  
  @Prop({ index: true })
  username: string;
  
  @Prop({ index: true })
  phone: string;
  
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: "customer" })
  role: string;

  @Prop()
  avatar: string;

  @Prop()
  bio: string;

  @Prop()
  company: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  emailValidated: boolean;
  
  @Prop()
  phoneValidated: boolean;
  
  @Prop({ default: new Date() })
  lastLogin: Date;

  @Prop({ default: new Date() })
  changePasswordAt: Date;

  @Prop({ default: 0 })
  cartTotal: number;
}

export const createUserSchema = (configService: ConfigService) => {
  const UserSchema = SchemaFactory.createForClass(User);

  UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      try {
        const encryptionService = new EncryptionService(configService);
        this.password = await encryptionService.bcryptHash(this.password);
        this.changePasswordAt = new Date();
        next();
      } catch (err) {
        console.log(err);
        throw new HttpException("Encryption Password Error.", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  })

  UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this as any;
    await this.model(VerificationCodes.name).deleteMany({ user: user._id });
    await this.model(Address.name).deleteMany({ user: user._id });
    await this.model(PaymentMethods.name).deleteMany({ user: user._id });
    next();
  });
  return UserSchema;
}