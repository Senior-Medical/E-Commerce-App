import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from "src/auth/enums/roles.enum";

@Injectable()
export class UserPermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = context.switchToHttp().getRequest().params.userId;
    const authUser = context.switchToHttp().getRequest().user;
    if (authUser.role === Role.customer && authUser._id.toString() !== userId) return false;
    return true;
  }
}