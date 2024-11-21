import { Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { CategoriesServices } from "src/categories/categories.service";

@Injectable()
export class CategoryIdPipe implements PipeTransform {
  constructor(
    private readonly categoriesServices: CategoriesServices,
  ) { }

  async transform(body: any) {
    if (body.category) {
      const category = await this.categoriesServices.findOne(body.category.toString());
      if (!category) throw new NotAcceptableException("Invalid category id.");
      body.category = category._id;
    }
    return body;
  }
}