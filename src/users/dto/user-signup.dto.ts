import { IsNotEmpty, IsInt,Min,IsString, MinLength, IsEmail } from "class-validator"; // Corrected imports
import { UserSigninDto } from "./user-signin";
export class UserSignupDto extends UserSigninDto {
    @IsNotEmpty({ message: "Name cannot be null" }) // Corrected decorator name
    @IsString({ message: "Name can only be a string" })
    name: string;

    @IsNotEmpty({ message: "Age cannot be empty" })
    @IsInt({ message: "Age must be an integer" })
    @Min(18, { message: "Age must be at least 18" }) // Optional validation for minimum age
    age: number;
}
