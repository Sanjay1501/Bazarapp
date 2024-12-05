import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity,  ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "src/products/entities/product.entity";
@Entity({name:'reviews'})
export class ReviewEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    ratings:number

    @Column()
    comment:string

    @CreateDateColumn()
    createdAt:Timestamp

    @UpdateDateColumn()
    updatedAt:Timestamp

    @ManyToOne(type=>UserEntity,(user)=>user.reviews)
    user:UserEntity;

    @ManyToOne(() => ProductEntity, (product) => product.reviews)
    product: ProductEntity;


}


