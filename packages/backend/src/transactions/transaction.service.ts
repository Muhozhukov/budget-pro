import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Budget } from 'src/budget/entities/budget.entity';
import { Category } from 'src/categories/entities/category.entity';
// import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { user_id, budget_id, category_id, type, amount, description, date } =
      createTransactionDto;
    console.log(123);
    // const user = await this.userRepository.findOne({ where: { id: user_id } });
    const budget = await this.budgetRepository.findOne({
      where: { id: budget_id },
    });
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });
    console.log(budget, category);
    // if (!user_id || !user) {
    //   throw new BadRequestException('No user attached');
    // }

    if (!category_id || !category) {
      throw new BadRequestException('No category attached');
    }

    if (!budget_id || !budget) {
      throw new BadRequestException('No budget attached');
    }

    const newTransaction = await this.transactionRepository.create({
      // user,
      budget,
      category,
      type,
      amount,
      description,
      date,
    });

    return this.transactionRepository.save(newTransaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['budget', 'category'],
    });
  }

  async findByQuery(query: {
    categoryId: number;
    budgetId: number;
    // userId: number;
  }): Promise<Transaction[]> {
    const { categoryId, budgetId } = query;

    console.log(query);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.budget', 'budget');

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (budgetId) {
      queryBuilder.andWhere('budget.id = :budgetId', { budgetId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['budget', 'category'],
    });
    if (!transaction) {
      return new NotFoundException('Not found!');
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
