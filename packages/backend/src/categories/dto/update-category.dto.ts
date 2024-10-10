export class UpdateCategorieDto {
  name: string;
  type: 'income' | 'expense' | 'saving';
  parent_category_id: number;
}
