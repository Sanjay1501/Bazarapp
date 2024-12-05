import { IsNotEmpty, IsInt,Min,IsString, MinLength, IsEmail } from "class-validator"; // Corrected imports

export class UserSigninDto {
   
    @IsNotEmpty({ message: "Email cannot be empty" }) // Corrected message
    @IsEmail({}, { message: "Please provide a valid email" }) // Corrected usage of IsEmail
    email: string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    @MinLength(5, { message: "Password must have at least 5 characters" })
    password: string;

}