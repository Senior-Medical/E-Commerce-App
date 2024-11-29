import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUsersDto } from "./createUser.dto";

/**
 * Defines the structure and validation rules for updating user information.
 * Inherits from CreateUsersDto but excludes the `password` field and makes all fields optional.
 */
export class UpdateUsersDto extends PartialType(OmitType(CreateUsersDto, ['password'])) { }