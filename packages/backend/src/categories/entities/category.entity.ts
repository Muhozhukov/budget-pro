import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'income' | 'expense' | 'saving';

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
  })
  parentCategory: Category; // Родительская категория (если это подкатегория)

  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories: Category[]; // Список подкатегорий (если это корневая категория)

  @ManyToOne(() => User, (user) => user.categories)
  user: User;
}
