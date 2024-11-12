import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]{3,16}$/, {
    message: "name can contain letters, numbers, and underscores only, and must be between 3 and 16 characters long."
  })
  readonly name: string;
  
  @IsOptional()
  @IsString()
  readonly description: string;
}