import { Injectable } from "@nestjs/common";
import { AddressesService } from '../addresses.service';
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";

/**
 * Guard to check if the authenticated user has permission to access a specific address.
 * - Ensures the address exists.
 * - Validates that customers can only access their own addresses.
 */
@Injectable()
export class AddressPermissionGuard extends PermissionBaseGuard {
  constructor(private readonly addressesService: AddressesService) {
    super();
  }

  findEntity(id: string): Promise<any> {
    return this.addressesService.findOne(id);
  }

  getEntityOwnerId(entity: any): string {
    return entity.user.toString();
  }

  getEntityKeyInRequest(): string {
    return AddressesService.getEntityName();
  }
}