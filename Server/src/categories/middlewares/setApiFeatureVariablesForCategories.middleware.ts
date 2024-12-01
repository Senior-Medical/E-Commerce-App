import { Injectable } from '@nestjs/common';
import { CategoriesServices } from '../categories.service';

@Injectable()
export class SetApiFeatureVariableForCategories {
  constructor(private readonly categoriesServices: CategoriesServices) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.categoriesServices.getModel(),
      searchArray: this.categoriesServices.getSearchKeys()
    }
    next();
  }
}
