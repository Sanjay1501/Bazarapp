import { IsNotEmpty, IsOptional, IsString, IsPostalCode, IsEnum } from 'class-validator';

export class CreateShippingDto {
    @IsNotEmpty({ message: "Phone should not be empty" })
    @IsString({ message: "Phone format should be string" })
    phone: string;

    @IsOptional()
    @IsString({ message: "Name should be a string" })
    name?: string;  // Optional field, use ? for optional properties

    @IsNotEmpty({ message: "Address should not be empty" })
    @IsString({ message: "Address format should be string" })
    address: string;

    @IsNotEmpty({ message: "City should not be empty" })
    @IsString({ message: "City format should be string" })
    city: string;

    @IsNotEmpty({ message: "Postcode should not be empty" })
    @IsString({ message: "Postcode format should be string" })
    postCode: string;

    @IsNotEmpty({ message: "State should not be empty" })
    @IsString({ message: "State format should be string" })
    state: string;

    @IsNotEmpty({ message: "Country should not be empty" })
    @IsString({ message: "Country format should be string" })
    country: string;
}
