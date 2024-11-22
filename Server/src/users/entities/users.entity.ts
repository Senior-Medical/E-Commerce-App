import { HttpException, HttpStatus } from "@nestjs/common";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { Role } from "src/auth/enums/roles.enum";
import { EncryptionService } from '../../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  
  @Prop({ unique: true, index: true })
  username: string;
  
  @Prop({ unique: true, index: true })
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

  @Prop({ default: false })
  emailValidated: boolean;
  
  @Prop({ default: false })
  phoneValidated: boolean;
  
  @Prop({ default: new Date() })
  lastLogin: Date;

  @Prop({ default: new Date() })
  changePasswordAt: Date;
  
  @Prop(raw({
    code:  String,
    expireAt: Date
  }))
  emailVerificationCode: Record<string, any>;
  
  @Prop(raw({
    code: String,
    expireAt: Date
  }))
  resetPasswordCode: Record<string, any>;

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
  
  return UserSchema;
}