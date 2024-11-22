import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { createUserSchema, User } from "./entities/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (configService: ConfigService) => createUserSchema(configService),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule{}