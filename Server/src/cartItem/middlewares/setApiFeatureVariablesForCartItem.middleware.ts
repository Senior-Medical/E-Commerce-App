import { Injectable } from '@nestjs/common';
import { CartItemService } from '../cartItem.service';

@Injectable()
export class SetApiFeatureVariableForCartItem {
  constructor(private readonly cartItemService: CartItemService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.cartItemService.getModel(),
      searchArray: this.cartItemService.getSearchKeys()
    }
    next();
  }
}
