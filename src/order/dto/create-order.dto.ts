import { ValidateNested } from "class-validator";
import { CreateShippingDto } from "./create-shipping.dto";
import { Type } from "class-transformer";
import { OrderedProductDto } from "./ordered-product.dto";

export class CreateOrderDto {
    @Type(()=>CreateShippingDto)
    @ValidateNested()
    shippingAddress:CreateShippingDto


    @Type(()=>OrderedProductDto)
    @ValidateNested()
    orderedProducts:OrderedProductDto[];
}
