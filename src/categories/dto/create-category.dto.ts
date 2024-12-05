import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message:"email is not empty"})
    @IsString({message:"Title should be string"})
    title:string

    @IsNotEmpty({message:"Description can not be empty"})
    @IsString({message:"description should be string"})
    description:string
}
