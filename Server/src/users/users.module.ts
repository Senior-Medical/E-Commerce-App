import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagingModule } from "src/messaging/messaging.module";
import { createUserSchema, User } from "./entities/users.entity";
import { VerificationCodes, getVerificationCodesSchema } from "./entities/verificationCodes.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
  MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (configService: ConfigService) => createUserSchema(configService),
        inject: [ConfigService]
      },
      {
        name: VerificationCodes.name,
        useFactory: async (configService: ConfigService) => getVerificationCodesSchema(configService),
        inject: [ConfigService]
      }
    ]),
    MessagingModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule{}