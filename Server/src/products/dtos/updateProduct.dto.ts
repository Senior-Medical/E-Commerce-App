import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./createProduct.dto";

/**
 * Data Transfer Object for updating an existing product.
 * Inherits all properties from CreateProductDto and makes them optional.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) { }