import { PartialType } from "@nestjs/mapped-types";
import { CreateAddressDto } from "./createAddress.dto";

/**
 * DTO for updating an address.
 * Inherits all fields from CreateAddressDto but makes them optional.
 */
export class UpdateAddressDto extends PartialType(CreateAddressDto) { }