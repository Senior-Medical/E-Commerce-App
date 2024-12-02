import { Injectable } from '@nestjs/common';
import { AddressesService } from '../addresses.service';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class SetApiFeatureVariableForAddresses {
  constructor(private readonly addressesService: AddressesService) {}

  use(req: Request & { apiFeature: { model: Model<any>, searchArray: string[] } }, res: Response, next: () => void) {
    req.apiFeature = {
      model: this.addressesService.getModel(),
      searchArray: this.addressesService.getSearchKeys()
    }
    next();
  }
}
