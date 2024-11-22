import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentMethods, createPaymentMethodsSchema } from "./entities/paymentMethods.entitiy";
import { PaymentMethodsController } from "./paymentMethods.controller";
import { PaymentMethodsService } from "./paymentMethods.service";
import { LuhnValidationConstraint } from "./utils/luhnValidation";

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