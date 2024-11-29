import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from '@nestjs/core';
import { Observable } from "rxjs";

/**
 * Guards the routes using the JWT strategy for authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * - Checks if the route is public (doesn't require authentication).
   * - If public, it allows access; otherwise, it uses JWT authentication.
   * 
   * @param context - ExecutionContext
   * @returns - `true` if public or valid JWT is provided.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}