import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { EncryptionModule } from "src/utils/encryption/encryption.module";
import { EncryptionService } from "src/utils/encryption/encryption.service";
import { PaymentMethods, createPaymentMethodsSchema } from "./entities/paymentMethods.entitiy";
import { PaymentMethodsController } from "./paymentMethods.controller";
import { PaymentMethodsService } from "./paymentMethods.service";
import { LuhnValidationConstraint } from "./utils/luhnValidation";

/**
 * PaymentMethodsModule
 * ---------------------
 * Handles all payment method operations such as creating, retrieving, updating, 
 * and deleting records. Ensures secure data handling, validation, and user access control.
 * 
 * Key Features:
 * -------------
 * 1. Data Validation:
 *    - Validates input using DTOs and custom validation (e.g., Luhn check for card numbers).
 * 
 * 2. Entity Management:
 *    - Manages the `PaymentMethods` schema with encryption for sensitive data.
 * 
 * 3. Access Control:
 *    - Includes guards and pipes to validate IDs and enforce ownership/security.
 * 
 * 4. Service Layer:
 *    - Implements business logic for card uniqueness, default method updates, and more.
 * 
 * Dependencies:
 * -------------
 * - UsersModule: For user-related operations and user ID validation.
 * - AuthModule: For role-based access control (`Roles` decorator).
 * 
 * Security and Validation:
 * ------------------------
 * - Ensures only authorized users can manage their payment methods using role-based 
 *   guards and ownership checks.
 * - Validates all incoming requests to prevent invalid or unauthorized operations.
 * 
 * Use Cases:
 * ----------
 * - Customers can add, view, update, and delete their payment methods.
 * - Admins and staff can view all payment methods or those associated with specific users.
 */
@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      imports: [EncryptionModule],
      name: PaymentMethods.name,
      useFactory: (encryptionService: EncryptionService) => createPaymentMethodsSchema(encryptionService),
      inject: [EncryptionService]
    }]),
    UsersModule,
    EncryptionModule,
    ApiFeatureModule
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, LuhnValidationConstraint],
})
export class PaymentMethodsModule {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.paymentMethodsService)).forRoutes(PaymentMethodsController);
  }
}