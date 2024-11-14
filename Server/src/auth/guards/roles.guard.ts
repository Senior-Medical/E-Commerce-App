import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/common/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    return requiredRoles.includes(user.role);
  }
}