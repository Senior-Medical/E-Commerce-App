import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { MulterModule } from "@nestjs/platform-express";
import { UsersModule } from "src/users/users.module";
import { EncryptionModule } from "src/utils/encryption/encryption.module";
import { FilesModule } from "src/utils/files/files.module";
import { FilesService } from "src/utils/files/files.service";
import { LoggerModule } from "src/utils/logger/logger.module";
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { getRefreshTokenSchema, RefreshToken } from "./entities/refreshTokens.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
/**
 * AuthModule encapsulates authentication-related functionalities.
 * It provides services, controllers, and dependencies for user authentication,
 * including token management, password reset, and verification mechanisms.
 * 
 * Key Features:
 * - Service Providers: AuthService, LocalStrategy, JwtStrategy.
 * - Imported Modules: UsersModule, ConfigModule, EncryptionModule, CodesModule.
 * - Mongoose Integration: Registering the RefreshToken schema.
 * 
 * Dependencies:
 * - MongooseModule: Manages MongoDB collections.
 * - ConfigModule: Retrieves configuration values.
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_ACCESS_EXPIRATION")
        }
      }),
      inject: [ConfigService]
    }),
    FilesModule,
    MulterModule.registerAsync({
      imports: [FilesModule],
      useFactory: (filesService: FilesService) => filesService.gitMulterOptions(),
      inject: [FilesService]
    }),
    MongooseModule.forFeatureAsync([
      {
        name: RefreshToken.name,
        useFactory: (configService: ConfigService) => getRefreshTokenSchema(configService),
        inject: [ConfigService]
      }
    ]),
    EncryptionModule,
    LoggerModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule {}