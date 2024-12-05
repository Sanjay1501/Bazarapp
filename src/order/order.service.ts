import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsService } from 'src/products/products.service'; // Import ProductsService
import { ProductEntity } from 'src/products/entities/product.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity) private readonly opRepository: Repository<OrdersProductsEntity>,
    private readonly productService: ProductsService, 
  ) {}

  // Create order method
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
  
    try {
      const shippingEntity = new ShippingEntity();
      Object.assign(shippingEntity, createOrderDto.shippingAddress);
      const orderEntity = new OrderEntity();
      orderEntity.shippingAddress = shippingEntity;
      orderEntity.user = currentUser;
  
      const orderTbl = await queryRunner.manager.save(orderEntity);
  
      const opEntities = [];
      for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
        const productDto = createOrderDto.orderedProducts[i];
        const product = await this.productService.findOne(productDto.id);
        if (!product) continue;
  
        opEntities.push({
          order: orderTbl,
          product: product,
          product_quantity: productDto.product_quantity,
          product_unit_price: productDto.product_unit_price,
        });
      }
  
      if (opEntities.length > 0) {
        await queryRunner.manager.save(opEntities);
      }
  
      await queryRunner.commitTransaction();
      return await this.findOne(orderTbl.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  

  async findAll():Promise<OrderEntity[]>{
    return await this.orderRepository.find({
      relations:{
        shippingAddress:true,
        user:true,
        products:{product:true}
      }
    })
  }
  
  
  
  // Find a single order by ID
  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { shippingAddress: true, user: true, products: { product: true } },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
  
    try {
      let order = await this.findOne(id);
      if (!order) throw new NotFoundException('Order not found');
  
      if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException(`Order already ${order.status}`);
      }
  
      if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status === OrderStatus.SHIPPED) {
        throw new BadRequestException('Delivery before shipped !!!');
      }
  
      if (order.status === OrderStatus.SHIPPED && updateOrderStatusDto.status === OrderStatus.SHIPPED) {
        return order;
      }
  
      if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
        order.shippedAt = new Date();
      }
      if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
        order.deliveredAt = new Date();
      }
  
      order.status = updateOrderStatusDto.status;
      order.updatedBy = currentUser;
      order = await queryRunner.manager.save(order);
  
      if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
        await this.stockUpdate(order, OrderStatus.DELIVERED);
      }
  
      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  


  async stockUpdate(order: OrderEntity, status: string) {
    const stockUpdates = order.products.map(op => {
      return this.productService.updateStock(+op.product.id, op.product_quantity, status);
    });
    await Promise.all(stockUpdates);
  }
 
  
  async cancelled(id:number,currentUser:UserEntity){
    let order=await this.findOne(id);
    if(!order) throw new NotFoundException("Order not found")

    if(order.status===OrderStatus.CANCELLED) return order;

    order.status=OrderStatus.CANCELLED;

    order.updatedBy=currentUser;
    order=await this.orderRepository.save(order)
    await this.stockUpdate(order,OrderStatus.CANCELLED)
    return order;
  }
  
}
