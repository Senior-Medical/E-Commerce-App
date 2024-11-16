import { IsInt, IsMongoId, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateProductReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rate: number;

  @IsMongoId()
  product: Types.ObjectId;
}