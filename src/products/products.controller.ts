import { Controller, Post, Body, UseGuards, Get, Param, Patch, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/users/entities/user.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utitlity/decorators/current-user-decorator';
import { AuthorizedGuard } from 'src/utitlity/guards/authorization.guard';
import { AuthenticationGuard } from 'src/utitlity/guards/authentication.guard';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }


  @Get()
  async findAll(@Query() query: any): Promise<any> {
    // You can use the 'query' parameter to filter or paginate results if needed
    return await this.productsService.findAll(query);
  }


  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: UserEntity 
  ): Promise<ProductEntity> {
    return await this.productsService.update(+id, updateProductDto, currentUser); // Pass currentUser to service method
  }
}

