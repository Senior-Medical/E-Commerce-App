import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRATION")
        }
      }),
      inject: [ConfigService]
    })
  ],

  controllers: [AuthController],
  
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule{}