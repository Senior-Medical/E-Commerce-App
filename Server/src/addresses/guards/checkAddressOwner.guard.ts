import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AddressesService } from '../addresses.service';

@Injectable()
export class CheckAddressOwnerGuard implements CanActivate {
  constructor(private readonly addressesService: AddressesService) { }

  async canActivate(context: ExecutionContext) {
    const params = context.switchToHttp().getRequest().params;
    const user = context.switchToHttp().getRequest().user;
    const address = await this.addressesService.findOne(params.addressId);
    return user._id.toString() === address.user.toString();
  }
}