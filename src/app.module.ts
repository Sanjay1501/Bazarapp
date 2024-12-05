import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'; // Correct import for MiddlewareConsumer
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentMiddleware } from './utitlity/middleware/current-user-middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrderModule } from './order/order.module';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, CategoriesModule, ProductsModule, ReviewsModule, OrderModule],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); 
  }
}
