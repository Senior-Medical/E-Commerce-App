import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { Types } from "mongoose";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }
  async canActivate(context: ExecutionContext) {
    const { authorization } = context.switchToHttp().getRequest().headers;
    if (!authorization) throw new UnauthorizedException("Refresh token required.");

    const tokenType: string = authorization.split(" ")[0];
    const token: string = authorization.split(" ")[1];
    if (!token || tokenType.toLowerCase() !== "bearer") throw new UnauthorizedException("Invalid token.");
    
    const payload = this.jwtService.verify(token);
    const userId = new Types.ObjectId(payload.sub as string);
    const refreshToken = await this.authService.findRefreshToken({ token, user: userId });
    const user = await this.usersService.findOne(payload.sub);
    if(!refreshToken || !user) throw new UnauthorizedException("Invalid token.");

    if(!user.verified) throw new UnauthorizedException("User not verified.");
    if (user.changePasswordAt) {
      let changePasswordDate = user.changePasswordAt.getTime() / 1000;
      const iat = payload.iat || 0;
      if (changePasswordDate > iat) throw new UnauthorizedException("Password changed.");
    }

    return true;
  }
}