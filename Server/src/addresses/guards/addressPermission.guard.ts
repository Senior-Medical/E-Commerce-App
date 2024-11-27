import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { AddressesService } from '../addresses.service';
import { Role } from "src/auth/enums/roles.enum";

@Injectable()
export class AddressPermissionGuard implements CanActivate {
  constructor(private readonly addressesService: AddressesService) { }

  async canActivate(context: ExecutionContext) {
    const { addressId } = context.switchToHttp().getRequest().params;
    const user = context.switchToHttp().getRequest().user;
    const address = await this.addressesService.findOne(addressId);
    if (!address) throw new NotFoundException("Address not found");
    if(user.role === Role.customer && address.user.toString() !== user._id.toString()) return false;
    return true;
  }
}