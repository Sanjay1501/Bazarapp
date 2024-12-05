import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';  // Import User entity
import { ProductEntity } from 'src/products/entities/product.entity';
@Entity({name:"Categories"})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;


  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;  

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];


}

