import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository, TreeLevelColumn } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService
  ) {}

 
  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity):Promise<ReviewEntity> {
    const product = await this.productService.findOne(createReviewDto.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if the user has already reviewed the product
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);

    if (review) {
      throw new Error('User has already reviewed this product');
    }

    // Create the review object
    review = this.reviewRepository.create({
      ratings: createReviewDto.ratings,
      comment: createReviewDto.comment,
      user: currentUser,
      product: product,
    });

    // Save the review to the database
    await this.reviewRepository.save(review);

    return review;


  }


  async findAllByProduct(productId: number): Promise<ReviewEntity[]> {
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }


  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async remove(id: number, currentUser: UserEntity): Promise<{ message: string }> {
    
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the current user is the one who wrote the review
    if (review.user.id !== currentUser.id) {
      throw new ForbiddenException('You cannot delete this review');
    }

    // Remove the review from the database
    await this.reviewRepository.remove(review);

    return { message: `Review with ID ${id} has been deleted` };
  }



  // Find a review by user and product
  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });
  }
}
