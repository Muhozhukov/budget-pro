import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Body() createBudgetDto: CreateBudgetDto): Promise<Budget> {
    return this.budgetService.create(createBudgetDto);
  }

  @Get()
  async findAll(): Promise<Budget[]> {
    return this.budgetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Budget> {
    return this.budgetService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<Budget> {
    return this.budgetService.update(+id, updateBudgetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Budget> {
    return this.budgetService.remove(+id);
  }
}
