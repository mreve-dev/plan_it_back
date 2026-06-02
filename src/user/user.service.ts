import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'prisma/generated/prisma/client';
import { UserWTPwd } from './interface/userWTPwd.interface';
import { OnBoarding } from './dto/onBoarding.dto';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(userData: CreateUserDto): Promise<UserWTPwd> {

    const newUser: UserWTPwd = await this.prisma.user.create({
      data: userData,
      omit: { password: true }
    })

    return newUser
  }

  // Retourne aussi les skills en plus des données de la table user

  async findAll(): Promise<User[] | null> {
    return this.prisma.user.findMany({
      include: {
        userHasSkills: {
          include: {
            skill: true
          }
        }
      }
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }


  // findFirst : comme findUnique mais pour un champ qui n'est pas marqué @unique dans Prisma. Retourne le premier résultat trouvé
  async findOneByResetToken(token: string): Promise<User | null>{
    return this.prisma.user.findFirst({
      where: {resetPasswordToken: token}
    })
  }

  async countEmail(email: string): Promise<number> {
    return this.prisma.user.count({ where: { email } })
  }


  async onboarding(id: number, data: OnBoarding): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        isOnboarded: true,
        userHasSkills: {
          // Pour chaque id de skill dans le tableau reçu (ex: [1, 3, 5]),
          // on crée une ligne dans User_has_Skill qui relie l'user à ce skill.
          // .map() transforme [1, 3, 5] en [{skill: {connect: {id: 1}}}, {skill: {connect: {id: 3}}}, ...]
          create: data.skillIds.map(skillId => ({
            skill: { connect: { id: skillId } }
          }))
        }
      }
    })

    return user
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUser

    });
  }


  async remove(id: number): Promise<void> {

    await this.prisma.user_has_Skill.deleteMany({where: {userId: id}})
    await this.prisma.user_Has_Mission.deleteMany({where: {userId: id}})
    await this.prisma.notification.deleteMany({where: {userId: id}})

    const deleteUser: User = await this.prisma.user.delete({ where: { id } });

    return
  }



}
