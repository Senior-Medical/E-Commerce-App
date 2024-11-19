import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { AddressesService } from "../addresses.service";

@Injectable()
export class AddressIdPipe implements PipeTransform {
  constructor(private readonly addressesService: AddressesService) { }

  async transform(addressId: string, metadata: ArgumentMetadata) {
    const address = await this.addressesService.findOne(addressId);
    if (!address) throw new NotFoundException("Address not found.");
    return address;
  }
}