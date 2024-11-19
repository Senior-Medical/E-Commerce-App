import { Module } from "@nestjs/common";
import { PaymentMethodsController } from "./paymentMethods.controller";
import { PaymentMethodsService } from "./paymentMethods.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentMethods, createPaymentMethodsSchema } from "./entities/paymentMethods.entitiy";
import { LuhnValidationConstraint } from "./utils/luhnValidation";
import { EncryptionService } from "./utils/encryption.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
  MongooseModule.forFeatureAsync([{
      name: PaymentMethods.name,
      useFactory: (configService: ConfigService) => createPaymentMethodsSchema(configService),
      inject: [ConfigService]
    }]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, LuhnValidationConstraint]
})
export class PaymentMethodsModule {}