import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CategoriesController } from './categories/categories.controller';
// import { TransactionsController } from './transactions/transactions.controller';
import { UsersModule } from './users/users.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
// import { DatabaseModule } from './database/database.module';
import { BudgetModule } from './budget/budget.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CategoriesModule,
    UsersModule,
    BudgetModule,
    // TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
