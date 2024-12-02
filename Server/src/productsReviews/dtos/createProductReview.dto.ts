import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min
} from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";

/**
 * Data Transfer Object for creating a new product review. Includes validation
 * for comment, rating, and associated product.
 */
export class CreateProductReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @Transform(({value}) => parseInt(value))
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;

  @IsMongoId()
  product: Types.ObjectId;
}