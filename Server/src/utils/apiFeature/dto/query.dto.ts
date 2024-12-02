import { IsOptional, IsInt, IsString, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  @Matches(/^[\w,-]+$/) // Comma-separated field names with optional "-" for descending sort
  sort?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\w,]+$/) // Comma-separated field names
  fields?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @Matches(/^{.*}$/) // Simple regex to ensure it's a JSON object
  filters?: string; // e.g: ?filters={"price":{"gte":100,"lte":500},"category":"electronics","rating":{"gte":4}}
}
