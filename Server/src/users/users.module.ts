import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { EncryptionModule } from "src/utils/encryption/encryption.module";
import { EncryptionService } from "src/utils/encryption/encryption.service";
import { FilesModule } from "src/utils/files/files.module";
import { FilesService } from "src/utils/files/files.service";
import { MessagingModule } from "src/utils/messaging/messaging.module";
import { setApiFeatureVariables } from "src/utils/shared/middlewares/apiFeature.middleware";
import { createUserSchema, User } from "./entities/users.entity";
import { getVerificationCodesSchema, VerificationCodes } from "./entities/verificationCodes.entity";
import { CodesService } from "./services/codes.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

/**
 * Manages user-related functionalities like account creation, updates, role management, and email/phone verification. 
 * It integrates MongoDB, encryption, file handling, and messaging for secure and efficient operations.
 * 
 * **Key Features:**
 * - User management (create, update, delete).
 * - Email/phone verification via verify link.
 * - Role management (admin, staff, customer).
 * - Avatar upload and password encryption.
 * 
 * **Imports:**
 * - **MongooseModule**: For `User` and `VerificationCodes` schemas.
 * - **MessagingModule**: Sends verification codes.
 * - **FilesModule**, **MulterModule**: Handles avatar uploads.
 * - **EncryptionModule**: For password encryption.
 * 
 * **Providers:**
 * - **UsersService**, **CodesService**, **EncryptionService**.
 * 
 * **Controller:**
 * - **UsersController**: Manages user data routes.
 * 
 * **Exports:**
 * - **UsersService**, **CodesService**.
 */
@Module({
  imports: [
  MongooseModule.forFeatureAsync([
    {
        imports: [EncryptionModule],
        name: User.name,
        useFactory: async (configService: ConfigService, encryptionService: EncryptionService) => createUserSchema(configService, encryptionService),
        inject: [ConfigService, EncryptionService]
      },
      {
        imports: [EncryptionModule],
        name: VerificationCodes.name,
        useFactory: async (configService: ConfigService, encryptionService: EncryptionService) => getVerificationCodesSchema(configService, encryptionService),
        inject: [ConfigService, EncryptionService]
      }
    ]),
    MessagingModule,
    FilesModule,
    MulterModule.registerAsync({
      imports: [FilesModule],
      useFactory: (filesService: FilesService) => filesService.gitMulterOptions(),
      inject: [FilesService]
    }),
    EncryptionModule,
    ApiFeatureModule
  ],
  controllers: [UsersController],
  providers: [UsersService, CodesService],
  exports: [UsersService, CodesService]
})
export class UsersModule {
  constructor(private readonly usersService: UsersService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.usersService)).forRoutes(UsersController);
  }
}