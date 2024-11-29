import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/auth/enums/roles.enum";

/**
 * Verifies if the user has the required roles to access the route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  
  /**
   * - Checks if the required roles are set on the route handler.
   * - Verifies if the user's role matches the required roles.
   * - Throws `UnauthorizedException` if the user does not have the required role.
   * 
   * @param context - ExecutionContext
   * @returns - `true` if the user has the required role, `false` otherwise.
   */
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