export class CreateCategorieDto {
  name: string;
  type: 'income' | 'expense' | 'saving';
  user_id: number;
  parent_category_id: number;
}
