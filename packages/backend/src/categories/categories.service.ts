import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategorieDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parentCategory: null }, // Загрузить только корневые категории
      // relations: ['subcategories'], // Загрузить связанные подкатегории
    });
    // return this.categoriesRepository.find();
  }

  async findCategoriesWithSubcategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parentCategory: null }, // Загрузить только корневые категории
      relations: ['subcategories'], // Загрузить связанные подкатегории
    });
  }

  async findById(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { id },
    });
  }

  async create(createCategorieDto: CreateCategorieDto): Promise<Category> {
    const { name, type, parent_category_id } = createCategorieDto;

    // Найти пользователя по ID
    // const user = await this.userRepository.findOne({ where: { id: userId } });
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    // Если указан parentCategoryId, найти родительскую категорию
    let parentCategory: Category = null;
    if (parent_category_id) {
      parentCategory = await this.categoriesRepository.findOne({
        where: { id: parent_category_id },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      if (parentCategory.type !== type) {
        throw new BadRequestException('Bad type of subcategory and category');
      }
    }

    // Создать новую категорию
    const newCategory = this.categoriesRepository.create({
      name,
      type,
      // user,
      parentCategory, // Может быть null, если это корневая категория
    });

    return this.categoriesRepository.save(newCategory);
  }

  async update(
    id: number,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<Category> {
    const { name, parent_category_id, type } = updateCategorieDto;

    const categoryToUpdate = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parentCategory', 'subcategories'],
    });

    if (!categoryToUpdate) {
      throw new NotFoundException('Not found');
    }

    if (!name || !type) {
      throw new BadRequestException('Bad request');
    }

    if (categoryToUpdate.subcategories[0].type !== type) {
      throw new BadRequestException(
        'Типы категории и ее субкатегорий не совпадают!',
      );
    }

    if (parent_category_id || categoryToUpdate.parentCategory) {
      const parentCategory = await this.categoriesRepository.findOneBy({
        id: parent_category_id || categoryToUpdate.parentCategory.id,
      });

      if (!parentCategory) {
        throw new BadRequestException('Bad request');
      }

      if (parentCategory.type !== type) {
        throw new BadRequestException(
          'Разные типы категории и ее родительской категории',
        );
      }
    }

    await this.categoriesRepository.update(id, updateCategorieDto);

    return this.categoriesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<Category> {
    const categoryToRemove = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });

    if (!categoryToRemove) {
      throw new NotFoundException('Категория не найдена!');
    }

    if (categoryToRemove.subcategories.length > 0) {
      await this.categoriesRepository.remove(categoryToRemove.subcategories);
    }

    await this.categoriesRepository.remove(categoryToRemove);

    return categoryToRemove;
  }
}
