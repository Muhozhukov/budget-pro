import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Budget } from 'src/budget/entities/budget.entity';
// import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  // @OneToMany(() => Transaction, (transaction) => transaction.user)
  // transactions: Transaction[];
}
