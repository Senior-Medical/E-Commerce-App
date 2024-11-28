import { PartialType } from "@nestjs/mapped-types"
import { CreateCategoryDto } from "./creatCategory.dto"

/**
 * Data transfer object used for updating an existing category. It extends 
 * the `CreateCategoryDto` and makes all fields optional to allow partial 
 * updates to the category.
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }