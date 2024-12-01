import { Injectable } from '@nestjs/common';
import { WishListService } from '../wishList.service';

@Injectable()
export class SetApiFeatureVariableForWishList {
  constructor(private readonly wishListService: WishListService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.wishListService.getModel(),
      searchArray: this.wishListService.getSearchKeys()
    }
    next();
  }
}
