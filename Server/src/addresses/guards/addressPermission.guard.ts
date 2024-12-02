import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { AddressesService } from '../addresses.service';
import { Role } from "src/auth/enums/roles.enum";

/**
 * Guard to check if the authenticated user has permission to access a specific address.
 * - Ensures the address exists.
 * - Validates that customers can only access their own addresses.
 */
@Injectable()
export class AddressPermissionGuard implements CanActivate {
  constructor(private readonly addressesService: AddressesService) { }

  /**
   * Determines if the request should be allowed.
   * @param context - The execution context of the request
   * @returns `true` if the user is the owner, admin or staff, `false` otherwise
   * @throws NotFoundException if the address does not exist
   */
  async canActivate(context: ExecutionContext) {
    const { addressId } = context.switchToHttp().getRequest().params;
    const user = context.switchToHttp().getRequest().user;
    
    const address = await this.addressesService.findOne(addressId);
    if (!address) throw new NotFoundException("Address not found");
    
    if (user.role === Role.customer && address.user.toString() !== user._id.toString()) return false;
    return true;
  }
}