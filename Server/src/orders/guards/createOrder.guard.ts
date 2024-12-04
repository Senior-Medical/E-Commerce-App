import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { AddressesService } from '../../addresses/addresses.service';

/**
 * Guard to check if the address belongs to the user
 */
@Injectable()
export class CreateOrderGuard implements CanActivate {
  constructor(private readonly addressesService: AddressesService) { }

  async canActivate(context: ExecutionContext) {
    const addressId = context.switchToHttp().getRequest().body.address;
    if (!addressId) throw new BadRequestException("Address id is required");

    const address = await this.addressesService.findOne(addressId);
    if (!address) throw new NotFoundException("Address not found");
    
    const user = context.switchToHttp().getRequest().user;
    if (address.user.toString() !== user._id.toString()) throw new UnauthorizedException("Address does not belong to user");

    return true;
  }
}