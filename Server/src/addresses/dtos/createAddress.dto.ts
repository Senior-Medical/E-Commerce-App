import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, Min } from "class-validator";

/**
 * DTO for creating a new address.
 * Enforces validation rules to ensure consistent and secure data entry.
 */
export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s\-_,.\/]{3,50}$/, {
    message: 'Title must be 3-50 characters long and include only valid symbols.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s\-_,.\/#]{5,100}$/, {
    message: 'Address line must be 5-100 characters long with valid symbols.',
  })
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]{2,56}$/, {
    message: 'Country must be 2-56 alphabetic characters or spaces.',
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]{2,50}$/, {
    message: 'City must be 2-50 alphabetic characters or spaces.',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]{2,50}$/, {
    message: 'State must be 2-50 alphabetic characters or spaces.',
  })
  state: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s\-]{3,12}$/, {
    message: 'Postal code must be 3-12 characters long, alphanumeric, or contain hyphens.',
  })
  postalCode: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-z0-9\s\-_,.\/]{3,50}$/, {
    message: 'Landmark must be 3-50 characters long and include only valid symbols.',
  })
  landmark?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;
  
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}