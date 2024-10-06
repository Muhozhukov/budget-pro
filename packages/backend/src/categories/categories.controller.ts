import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';

@Controller('categories')
export class CategoriesController {
  @Get()
  async findAll(): Promise<string> {
    return 'This action return all categories';
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<string> {
    return `categorie by #${id}`;
  }

  @Post()
  async create(
    @Body() createCategorieDto: CreateCategorieDto,
  ): Promise<CreateCategorieDto> {
    return createCategorieDto;
  }
}
