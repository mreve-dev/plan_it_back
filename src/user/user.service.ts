import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'prisma/generated/prisma/client';
import { UserWTPwd } from './interface/userWTPwd.interface';

 @Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateUserDto): Promise<UserWTPwd> {
    
      const newUser : UserWTPwd = await this.prisma.user.create({
        data,
        omit: {password:true}
      })
  
      return newUser
  }

  async findAll() : Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({where: {id}});
  }

  async findOneByEmail(email: string) : Promise<User | null> {
    return this.prisma.user.findUnique({where : {email}})
  }

  async countEmail(email: string): Promise<number> {
    return this.prisma.user.count({where: {email}})
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {id},
      data: updateUser
    });
  }
  

  async remove(id: number): Promise<void> { 

    // this.prisma.user_has_Skill.createMany({
    //   data: [{skillId,userId}]
    // })

    const deleteUser : User = await this.prisma.user.delete({where: {id}});

    return
  }

  
}
