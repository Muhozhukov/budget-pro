import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;

  @OneToMany(() => Transaction, (transactions) => transactions.budget)
  transactions: Transaction[];
}
