import { Injectable } from '@nestjs/common';
import { CategoriesServices } from '../categories.service';

@Injectable()
export class SetApiFeatureVariableForCategories {
  constructor(private readonly CategoriesServices: CategoriesServices) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.CategoriesServices.getModel(),
      searchArray: this.CategoriesServices.getSearchKeys()
    }
    next();
  }
}
