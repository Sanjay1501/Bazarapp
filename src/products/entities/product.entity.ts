import { Category } from "src/categories/entities/category.entity";
import { OrdersProductsEntity } from "src/order/entities/order-products.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, NumericType, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    title: string

    @Column()
    description: string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number

    @Column()
    stock: number

    @Column('simple-array')
    images: string[];

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp


    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    @ManyToOne(() => Category, (cat) => cat.products)
    category: Category;


    @OneToMany(() => ReviewEntity, (review) => review.product)
    reviews: ReviewEntity[];

    @OneToMany(()=>OrdersProductsEntity,(op)=>op.product)
    products:OrdersProductsEntity[]

}




