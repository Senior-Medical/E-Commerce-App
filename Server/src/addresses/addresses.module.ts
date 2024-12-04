import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { Address, AddressSchema } from "./entities/addresses.entity";

/**
 * Address Module
 * 
 * This module handles the management of user addresses in the e-commerce application. 
 * It provides functionalities for creating, updating, retrieving, and deleting addresses, 
 * ensuring proper validation and authorization. 
 * 
 * Key Features:
 * 1. CRUD operations for user addresses:
 *    - Create: Add new addresses for users.
 *    - Read: Fetch addresses by user or address ID.
 *    - Update: Modify existing address details.
 *    - Delete: Remove addresses securely.
 * 
 * 2. Security and Validation:
 *    - Pipes (e.g., AddressIdPipe): Validate and fetch address details.
 *    - Guards (e.g., AddressPermissionGuard): Enforce user permissions for address operations.
 * 
 * 3. Schema Integration:
 *    - MongoDB schema for addresses defined using Mongoose.
 *    - Relationships with the `User` model to associate addresses with users.
 * 
 * Dependencies:
 * - Users Module: For user-related operations and data validation.
 * - Mongoose: For schema definition, database interactions, and relationship management.
 * 
 * Controllers:
 * - AddressesController: Manages HTTP requests for address-related actions.
 * 
 * Services:
 * - AddressesService: Contains the core business logic for managing addresses.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema }
    ]),
    UsersModule,
    ApiFeatureModule
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService]
})
export class AddressesModule {
  constructor(private readonly addressesService: AddressesService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.addressesService)).forRoutes(AddressesController);
  }
}