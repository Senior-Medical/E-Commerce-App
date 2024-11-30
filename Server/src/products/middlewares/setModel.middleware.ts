import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SetModelMiddleware {
  constructor(private readonly productsService: ProductsService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.productsService.getModel(),
      searchArray: this.productsService.getSearchKeys()
    }
    next();
  }
}
