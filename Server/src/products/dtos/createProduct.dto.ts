import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

/**
 * Data Transfer Object for creating a new product.
 * Ensures input validation and type transformation for product properties.
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
  
  @IsString()
  @IsNotEmpty()
  code: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsMongoId()
  category: Types.ObjectId;
}