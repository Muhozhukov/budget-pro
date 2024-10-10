import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { UpdateCategorieDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findCategoriesWithSubcategories();
  }

  // @Get('subcategories')
  // async findCategoriesWithSubcategories(): Promise<Category[]> {
  //   return this.categoriesService.findCategoriesWithSubcategories();
  // }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findById(+id);
  }

  @Post()
  async create(
    @Body() createCategorieDto: CreateCategorieDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategorieDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategorieDto: UpdateCategorieDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategorieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.remove(+id);
  }
}
