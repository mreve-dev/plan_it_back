import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Category } from 'prisma/generated/prisma/client';


@Injectable()
export class CategoryService {

  constructor(private readonly prisma: PrismaService) { }

  private async getCategoryOrFail(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }


  // Création d'une catégorie pour les évènements
  async create(createCategory: CreateCategoryDto): Promise<Category> {

    const newCategory: Category = await this.prisma.category.upsert({
      where: {name: createCategory.name},
      update: {},
      create: {name: createCategory.name}
    })

    return newCategory
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: number): Promise<Category> {
    return this.getCategoryOrFail(id);
  }

  async update(id: number, updateCategory: UpdateCategoryDto): Promise<Category> {

    await this.getCategoryOrFail(id)

    return this.prisma.category.update({
      where: { id },
      data: updateCategory
    });
  }

  async remove(id: number): Promise<Category> {

    await this.getCategoryOrFail(id)

    return this.prisma.category.delete({ where: { id } });
  }
}
