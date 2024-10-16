import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const { name, user_id, description } = createBudgetDto;

    const user: User = null;
    console.log(user);
    if (!user_id) {
      throw new BadRequestException('Не указан пользователь!');
    }
    const newBudget = await this.budgetRepository.create({
      name,
      user_id,
      description,
    });

    return this.budgetRepository.save(newBudget);
  }

  async findAll(): Promise<Budget[]> {
    return this.budgetRepository.find();
  }

  async findOne(id: number): Promise<Budget> {
    return this.budgetRepository.findOneBy({ id });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const { name, description } = updateBudgetDto;
    const budgetToUpdate = await this.budgetRepository.findOneBy({ id });

    console.log(budgetToUpdate);

    if (!budgetToUpdate) {
      throw new NotFoundException('Бюджет не был найдет');
    }
    budgetToUpdate.name = name;
    budgetToUpdate.description = description
      ? description
      : budgetToUpdate.description;

    await this.budgetRepository.update({ id }, budgetToUpdate);

    return budgetToUpdate;
  }

  async remove(id: number): Promise<Budget> {
    const budgetToDelete = await this.budgetRepository.findOneBy({ id });

    if (!budgetToDelete) {
      throw new NotFoundException('Бюджет не был найден!');
    }

    return this.budgetRepository.remove(budgetToDelete);
  }
}
