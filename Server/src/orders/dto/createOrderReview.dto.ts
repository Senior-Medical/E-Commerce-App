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
 * Data Transfer Object for creating a new order review. Includes validation
 * for comment, rating, and associated order.
 */
export class CreateOrderReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @Transform(({value}) => parseInt(value))
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;
}