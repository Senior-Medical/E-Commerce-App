import { HttpException, HttpStatus } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/auth/enums/roles.enum";
import { EncryptionService } from '../../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { VerificationCodes } from "./verificationCodes.entity";
import { Address } from "src/addresses/entities/addresses.entity";
import { PaymentMethods } from "src/paymentsMethods/entities/paymentMethods.entitiy";
import { Category } from "src/categories/entities/categories.entity";
import { Product } from "src/products/entities/products.entity";
import { ProductsReviews } from "src/productsReviews/entities/productsReviews.entity";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { AddressesService } from "src/addresses/addresses.service";
import { CategoriesServices } from "src/categories/categories.service";

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