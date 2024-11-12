import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { CategoriesServices } from '../categories.service';

@Injectable()
export class CategoryIdPipe implements PipeTransform {
  constructor(private readonly categoriesServices: CategoriesServices) { }
  async transform(categoryId: any, metadata: ArgumentMetadata) {
    const category = await this.categoriesServices.findOne(categoryId);
    if (!category) throw new NotFoundException("Category not found.");
    return category;
  }
}