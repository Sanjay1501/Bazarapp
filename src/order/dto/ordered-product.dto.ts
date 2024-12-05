import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductDto {
  @IsNotEmpty({ message: "Product cannot be empty" })
  id: number;

  @IsNumber({}, { message: "Price should be a number and maximum 2 decimal places" })
  @IsPositive({ message: "Price cannot be negative" })
  product_unit_price: number;

  @IsNumber({}, { message: "Quantity should be a number" })
  @IsPositive({ message: "Quantity cannot be negative" })
  product_quantity: number;
}
