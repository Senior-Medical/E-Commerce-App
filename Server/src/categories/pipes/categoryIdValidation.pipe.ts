import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { CategoriesServices } from '../categories.service';

/**
 * This pipe validates the category ID from the route parameters and checks if 
 * the category exists in the database. If the category does not exist, a 
 * `NotFoundException` is thrown.
 */
@Injectable()
export class CategoryIdPipe implements PipeTransform {
  constructor(private readonly categoriesServices: CategoriesServices) { }
  
  async transform(categoryId: string, metadata: ArgumentMetadata) {
    const category = await this.categoriesServices.findOne(categoryId);
    if (!category) throw new NotFoundException("Category not found.");
    return category;
  }
}