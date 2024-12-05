import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticationGuard } from 'src/utitlity/guards/authentication.guard';
import { CurrentUser } from 'src/utitlity/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthorizedGuard } from 'src/utitlity/guards/authorization.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from 'src/users/entities/user.entity';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto,@CurrentUser() currentUser:UserEntity){
    return await this.orderService.create(createOrderDto,currentUser);
  }

  @Get()
async findAll(): Promise<OrderEntity[]> {
  return await this.orderService.findAll();
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }

 @UseGuards(AuthenticationGuard,AuthorizedGuard([Roles.ADMIN]))
  @Put(':id')
  async update(@Param('id') id:string,@Body() updateOrderStatusDto:UpdateOrderStatusDto,@CurrentUser() currentUser:UserEntity){
    return await this.orderService.update(+id,updateOrderStatusDto,currentUser);
  }
  

  @Put('cancel/:id')
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  async cancelled(@Param('id') id: string, @CurrentUser() currentUser: UserEntity) {
    return await this.orderService.cancelled(+id,currentUser)
  }
  }

