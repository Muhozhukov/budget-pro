import { Injectable, Inject } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { Categories } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORIES_REPOSITORY')
    private catsRepository: typeof Categories,
  ) {}

  async findAll(): Promise<Categories[]> {
    return this.catsRepository.findAll<Categories>();
  }
}
