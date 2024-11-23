import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET")
    })
  }

  async validate(payload: any) {
    // [1] check if token valid or not
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException("Invalid token.");

    // [2] check if user change password
    if (user.changePasswordAt) {
      let changePasswordDate = user.changePasswordAt.getTime() / 1000;
      const iat = payload.iat || 0;
      if (changePasswordDate > iat) throw new UnauthorizedException("Password changed.");
    }

    return user;
  }
}