import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { FilesModule } from "src/files/files.module";
import { MulterModule } from "@nestjs/platform-express";
import { FilesService } from "src/files/files.service";
import { MongooseModule } from "@nestjs/mongoose";
import { getRefreshTokenSchema } from "./entities/refreshTokens.entity";

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
        name: "RefreshToken",
        useFactory: (configService: ConfigService) => getRefreshTokenSchema(configService),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule{}