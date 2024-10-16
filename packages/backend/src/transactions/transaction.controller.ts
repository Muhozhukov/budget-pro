import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  async findByQuery(
    @Query('categoryId') categoryId: number,
    // @Query('userId') userId: number,
    @Query('budgetId') budgetId: number,
  ) {
    return this.transactionService.findByQuery({ categoryId, budgetId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
