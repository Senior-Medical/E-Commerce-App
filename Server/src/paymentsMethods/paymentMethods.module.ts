import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentMethods, createPaymentMethodsSchema } from "./entities/paymentMethods.entitiy";
import { PaymentMethodsController } from "./paymentMethods.controller";
import { PaymentMethodsService } from "./paymentMethods.service";
import { LuhnValidationConstraint } from "./utils/luhnValidation";
import { UsersModule } from "src/users/users.module";

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
 * - CommonModule: For reusable utilities, including `ObjectIdValidationPipe` and `EncryptionService`.
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
      name: PaymentMethods.name,
      useFactory: (configService: ConfigService) => createPaymentMethodsSchema(configService),
      inject: [ConfigService]
    }]),
    UsersModule
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, LuhnValidationConstraint],
})
export class PaymentMethodsModule {}