import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

  @IsNotEmpty({ message: "Product should not be empty" })
  @IsNumber({}, { message: "Product ID should be a number" })
  productId: number;

  @IsNotEmpty({ message: "Ratings cannot be empty" })
  @IsNumber({}, { message: "Ratings should be a number" })
  ratings: number;

  @IsNotEmpty({ message: "Comment should not be empty" })
  @IsString({ message: "Comment should be a string" })
  comment: string;
}
