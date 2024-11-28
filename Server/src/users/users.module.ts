import { Module } from "@nestjs/common";
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
    EncryptionModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule{}