import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagingModule } from "src/messaging/messaging.module";
import { createUserSchema, User } from "./entities/users.entity";
import { VerificationCodes, getVerificationCodesSchema } from "./entities/verificationCodes.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { FilesModule } from "src/files/files.module";
import { MulterModule } from "@nestjs/platform-express";
import { FilesService } from "src/files/files.service";
import { EncryptionModule } from "src/encryption/encryption.module";
import { EncryptionService } from "src/encryption/encryption.service";
import { CodesService } from "./services/codes.service";
import { ApiFeatureModule } from "src/apiFeature/apiFeature.module";
import { SetApiFeatureVariableForUsers } from "./middlewares/setApiFeatureVariablesForUsers.middleware";

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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetApiFeatureVariableForUsers).forRoutes(UsersController);
  }
}