import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateProductReviewDto } from "./createProductReview.dto";
/**
 * Data Transfer Object for updating an existing product review. 
 * Inherits from `CreateProductReviewDto` but excludes the `product` field.
 */
export class UpdateProductReviewDto extends PartialType(OmitType(CreateProductReviewDto, ["product"] as const)) { }