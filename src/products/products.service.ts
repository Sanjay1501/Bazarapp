import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { NumericType, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { OrderStatus } from 'src/order/entities/order.entity';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';
import dataSource from 'db/data-source';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) {}

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;

    return await this.productRepository.save(product);
  }

  async findAll(query:any): Promise<any> {
    let filteredTotalProducts:number;
    let limit:number;

    if(!query.limit){
      limit=4;
    }
    else{
      limit=query.limit;
    }

    const queryBuilder=dataSource.getRepository(ProductEntity).createQueryBuilder('product')
    .leftJoinAndSelect('product.category','category')
    .leftJoin('product.reviews','review')
    .addSelect([
      'Count(review.id) AS reviewCount',
      'AVG(review.ratings)::numeric(10,2) AS avgRating'
    ])
    .groupBy('product.id,category.id')

    if(query.search){
      const search=query.search;
      queryBuilder.andWhere("product.title like :title",{title:`%${search}%`})
    }
    if (query.category) {
      queryBuilder.andWhere('category.id=:id',{id:query.category});
    }

    if(query.minPrice){
      queryBuilder.andWhere("product.price>=minPrice",{minPrice:query.minPrice})
    }

    if(query.maxPrice){
      queryBuilder.andWhere("product.price<=mazPrice",{maxPrice:query.maxPrice})
    }
  

    const products=await queryBuilder.getRawMany();
    return products
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  }


  

  async update(id: number, updateProductDto: Partial<UpdateProductDto>, currentUser: UserEntity): Promise<ProductEntity> {
    const product = await this.findOne(id);
    
   
    Object.assign(product, updateProductDto);

    
    product.addedBy = currentUser;

    
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(+updateProductDto.categoryId);
      if (category) {
        product.category = category;
      }
    }

    return await this.productRepository.save(product);
  }

  async updateStock(id:number,stock:number,status:string){
    let product=await this.findOne(id);
    if(status===OrderStatus.DELIVERED){
      product.stock-=stock;
    }
    else{
      product.stock+=stock;
    }
  }
}
