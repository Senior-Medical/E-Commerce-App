import { Injectable } from "@nestjs/common";
import { UsersService } from 'src/users/users.service';
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";

/**
 * Guards routes to ensure customers can only access their own resources.
 * - Admins or higher roles bypass this guard.
 */
@Injectable()
export class UserPermissionGuard extends PermissionBaseGuard {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  
  findEntity(id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  getEntityOwnerId(entity: any): string {
    return entity._id;
  }
  getEntityKeyInRequest(): string {
    return UsersService.getEntityName();
  }
}