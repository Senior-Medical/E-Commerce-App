import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { AddressesService } from "../addresses.service";

/**
 * Pipe to validate and transform the `addressId` parameter.
 * - Ensures the provided ID corresponds to an existing address.
 * - Fetches the address document and passes it to the route handler if valid.
 */
@Injectable()
export class AddressIdPipe implements PipeTransform {
  constructor(private readonly addressesService: AddressesService) { }

  /**
   * Transforms the provided `addressId` into an address document.
   * @param addressId - The ID of the address to validate
   * @param metadata - Metadata about the argument being transformed
   * @returns The address document if validation succeeds
   * @throws NotFoundException if the address does not exist
   */
  async transform(addressId: string, metadata: ArgumentMetadata) {
    const address = await this.addressesService.findOne(addressId);
    if (!address) throw new NotFoundException("Address not found.");
    return address;
  }
}