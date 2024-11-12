import { PartialType } from "@nestjs/mapped-types"
import { CreateCategoryDto } from "./creatCategory.dto"

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }