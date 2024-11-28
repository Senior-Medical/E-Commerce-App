import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { ProductsService } from "../products.service";

/**
 * Validates a product ID and resolves it to the corresponding product document.
 * Throws an exception if the product is not found.
 */
@Injectable()
export class ProductIdPipe implements PipeTransform {
  constructor(private readonly productsService: ProductsService) { }
  
  async transform(productId: string, metadata: ArgumentMetadata) {
    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException("Product not found.");
    return product;
  }
}