import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
  
  @IsNotEmpty({ message: "Title cannot be blank" })
  @IsString()
  title: string;

  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsString()
  description: string;

  @IsNotEmpty({ message: "Price should be a valid number" })
  @IsNumber({}, { message: "Price should be a number" })
  @IsPositive({ message: "Price should be positive" })
  price: number;

  @IsNotEmpty({ message: "Stock should not be empty" })
  @IsNumber({}, { message: "Stock should be a number" })
  @Min(0, { message: "Stock cannot be negative" })
  stock: number;

  @IsNotEmpty({ message: "Images should not be empty" })
  @IsArray({ message: "Images should be in array format" })
  images: string[];

  @IsNotEmpty({ message: "Category should not be empty" })
  @IsNumber({}, { message: "Category id should be a number" })
  categoryId: number;
}
