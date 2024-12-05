import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Timestamp } from "typeorm";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { OrderEntity } from "src/order/entities/order.entity";
import { Category } from "src/categories/entities/category.entity";
export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    age: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: Roles,
        array: true,
        default: [Roles.USER],
    })
    roles: Roles[];

    @CreateDateColumn()
    createAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => Category, (category) => category.addedBy)
    categories: Category[];

    @OneToMany(() => ProductEntity, (product) => product.addedBy)
    products: ProductEntity[];

    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    reviews: ReviewEntity[];

    @OneToMany(() => OrderEntity, (order) => order.updatedBy)
    ordersUpdatedBy: OrderEntity[]; 
    
    @OneToMany(()=>OrderEntity,(order)=>order.user)
    orders:OrderEntity[]

}
