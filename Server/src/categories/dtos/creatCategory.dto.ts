import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches
} from "class-validator"

/**
 * Data transfer object used for creating a new category. It ensures that 
 * the category name follows a specific pattern and validates the optional 
 * description field.
 */
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