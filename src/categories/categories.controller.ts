import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDTO } from './dtos/create-category.dto'
import { UpdateCategoryDTO } from './dtos/update-categoty.dto'
import { CategoriesService } from './categories.service';

@Controller('api/v1/categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategory: CreateCategoryDTO): Promise<Category> {
    return await this.categoriesService.createCategory(createCategory)
  }

  @Get()
  async consultCategory(): Promise<Array<Category>> {
    return await this.categoriesService.consultAllCategories()
  }

  @Get('/:category')
  async consultAllCategoryById(@Param('category') category: string): Promise<Category> {
    return await this.categoriesService.consultCategoryById(category);
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(@Body() updateCategoryDTO: UpdateCategoryDTO, @Param('category') category: string): Promise<void> {
    await this.categoriesService.updateCategory(category, updateCategoryDTO)
  }

  @Post('/:category/players/:idPlayer')
  async AddPlayerCategory(@Param() params: Array<String>): Promise<void> {
    return await this.categoriesService.AddPlayerCategory(params)
  }
}
