import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizedGuard } from 'src/utitlity/guards/authorization.guard';
import { AuthenticationGuard } from 'src/utitlity/guards/authentication.guard';
import { Roles } from 'src/users/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundError } from 'rxjs';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  // Apply guards for authentication and authorization
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))  
  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<Category> {
    // Create a new category from DTO
    const category = this.categoryRepository.create(createCategoryDto);

    // Set the user who created the category
    category.addedBy = currentUser;

    // Save the new category
    return await this.categoryRepository.save(category);
  }


  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    return category;
  }
  

  async findAll():Promise<Category[]>{
    return await this.categoryRepository.find()
  }
   

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  async update(id: number, fields: Partial<UpdateCategoryDto>): Promise<Category> {
    const category = await this.findOne(id); // Check if category exists
    if (!category) throw new NotFoundException('Category not found');

    // Assign the updated fields to the category
    Object.assign(category, fields);

    // Save and return the updated category
    return await this.categoryRepository.save(category);
  }

}


