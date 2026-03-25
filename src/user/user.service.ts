import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'prisma/generated/prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createUser: CreateUserDto) {
  
      const newUser : User = await this.prisma.user.create({
        data : createUser
      })
  
      return newUser
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({where: {id}});
  }

  async update(id: number, updateUser: UpdateUserDto) {
    return this.prisma.user.update({
      where: {id},
      data: updateUser
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({where: {id}});
  }
}
