import { Controller, Post, Body, Delete, Param, UseGuards, Get} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticationGuard } from 'src/utitlity/guards/authentication.guard';
import { CurrentUser } from 'src/utitlity/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { ProductsService } from 'src/products/products.service';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Create a new review
  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('all')
async findAllByProduct(@Body() body: { productId: number }) {
  const { productId } = body;  // Extract productId from the body
  return await this.reviewsService.findAllByProduct(productId);
}



  @Get(':id')
  async findOne(@Param('id') id:string){
    return this.reviewsService.findOne(+id)
  }


  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserEntity
  ): Promise<{ message: string }> {
    await this.reviewsService.remove(id, currentUser);  
    return { message: `Review with ID ${id} has been removed` };
  }
}
