import { Injectable } from '@nestjs/common';
import { AddressesService } from '../addresses.service';

@Injectable()
export class SetApiFeatureVariableForAddresses {
  constructor(private readonly addressesService: AddressesService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.addressesService.getModel(),
      searchArray: this.addressesService.getSearchKeys()
    }
    next();
  }
}
