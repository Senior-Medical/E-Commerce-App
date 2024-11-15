import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  // cover: File;
  
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsMongoId()
  category: Types.ObjectId;
}