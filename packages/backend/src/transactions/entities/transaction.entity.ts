import { Budget } from 'src/budget/entities/budget.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['income', 'expense', 'saving'] })
  type: 'income' | 'expense' | 'saving'; // Тип операции

  @ManyToOne(() => Category)
  category: Category; // Категория или подкатегория

  @ManyToOne(() => Budget, (budget) => budget.transactions)
  budget: Budget; // Связь с бюджетом

  @ManyToOne(() => User, (user) => user.transactions)
  user: User; // Связь с пользователем

  @Column({ nullable: true })
  description: string; // Описание транзакции
}
