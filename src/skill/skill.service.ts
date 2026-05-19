import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Skill } from 'prisma/generated/prisma/client';

@Injectable()
export class SkillService {


  constructor(private readonly prisma: PrismaService) { }

  private async getSkillOrFail(id: number) {
    const skill = await this.prisma.skill.findUnique({ 
      where: { id } 
    })

    if (!skill) {
      throw new NotFoundException('Skill not found')
    }

    return skill
  }

  async create(createSkill: CreateSkillDto): Promise<Skill> {

    const newSkill = await this.prisma.skill.create({
      data: createSkill
    })

    return newSkill;
  }

  async findAll(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  async findOne(id: number): Promise<Skill> {
    return this.getSkillOrFail(id);
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {

    await this.getSkillOrFail(id)

    return this.prisma.skill.update({
      data: updateSkillDto,
      where: { id }
    });
  }

  async remove(id: number): Promise<Skill> {

    await this.getSkillOrFail(id)

    return this.prisma.skill.delete({
      where: { id }
    });
  }
}
