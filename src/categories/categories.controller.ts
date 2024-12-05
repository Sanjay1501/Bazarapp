import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CurrentUser } from 'src/utitlity/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto, 
    @CurrentUser() currentUser: UserEntity
  ): Promise<Category> {
    
  return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get('all')
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id:string){
    return await this.categoriesService.findOne(+id)
  }

  
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,  // Get the category ID from the URL
    @Body() updateCategoryDto: UpdateCategoryDto,  // Get the fields to update from the request body
  ) {
    const categoryId = parseInt(id, 10);
    return await this.categoriesService.update(categoryId, updateCategoryDto);
  }


  

  
}

