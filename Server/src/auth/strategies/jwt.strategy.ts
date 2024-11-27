import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET")
    })
  }

  async validate(payload: any) {
    const refreshToken = await this.authService.findRefreshToken({_id: payload.refreshTokenId});
    const user = await this.usersService.findOne(payload.sub);

    if(!refreshToken || !user) throw new UnauthorizedException("Invalid token.");
    if(!user.verified) throw new UnauthorizedException("User not verified.");
    if (user.changePasswordAt) {
      let changePasswordDate = user.changePasswordAt.getTime() / 1000;
      const iat = payload.iat || 0;
      if (changePasswordDate > iat) throw new UnauthorizedException("Password changed.");
    }

    return user;
  }
}