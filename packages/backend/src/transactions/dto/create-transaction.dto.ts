export class CreateTransactionDto {
  amount: number;
  date: Date;
  type: 'income' | 'expense' | 'saving';
  category_id: number;
  user_id: number;
  budget_id: number;
  description: string;
}
