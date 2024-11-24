import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUsersDto } from "./createUser.dto";

export class UpdateUsersDto extends PartialType(OmitType(CreateUsersDto, ['password'])) { }