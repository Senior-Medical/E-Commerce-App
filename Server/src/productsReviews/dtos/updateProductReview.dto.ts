import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateProductReviewDto } from "./createProductReview.dto";

export class UpdateProductReviewDto extends PartialType(OmitType(CreateProductReviewDto, ["product"] as const)) { }