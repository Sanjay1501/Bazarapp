import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./order-products.entity";

export enum OrderStatus {
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

@Entity({ name: 'orders' })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: string;

    @Column({ nullable: true })
    shippedAt: Date;

    @Column({ nullable: true })
    deliveredAt: Date;

    @CreateDateColumn()
    orderAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
    updatedBy: UserEntity;

    @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
    @JoinColumn()
    shippingAddress: ShippingEntity;

    @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
    products: OrdersProductsEntity[];

    @ManyToOne(()=>UserEntity,(user)=>user.orders)
    user:UserEntity
}


