import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { RoleEnum, User } from 'prisma/generated/prisma/client';
import { UserWTPwd } from './interface/userWTPwd.interface';
import { OnBoarding } from './dto/onBoarding.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) { }

  // Centralise la règle : retire les champs admin-only si le demandeur n'est pas admin
  private filterByRole<T extends { email?: string }>(data: T, requesterRole: string): T | Omit<T, 'email'> {
    if (requesterRole === 'admin') return data
    const { email, ...rest } = data
    return rest
  }

  async create(userData: CreateUserDto): Promise<UserWTPwd> {

    const hashedPassword = await this.authService.hash(userData.password)

    const newUser: UserWTPwd = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      },
      omit: { password: true }
    })

    return newUser
  }

  // Retourne aussi les skills en plus des données de la table user

  async findAll(requestRole: string): Promise<(UserWTPwd | Omit<UserWTPwd, 'email'>)[]> {
    const users = await this.prisma.user.findMany({
      omit: { password: true },
      include: {
        userHasSkills: {
          include: {
            skill: true
          }
        }
      }
    });

    return users.map(u => this.filterByRole(u, requestRole))
  }

  async findOneFiltered(id: number, requesterRole: string): Promise<UserWTPwd | Omit<UserWTPwd, 'email'> | null>{
    const user = await this.findOne(id)
    if (!user) return null
    return this.filterByRole(user, requesterRole)
  }

  // Pour usage interne uniquement (login, changement de mdp)
  async findOneWithPassword(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }




  async findOne(id: number): Promise<UserWTPwd | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userHasSkills: {
          include: {
            skill: true
          }
        }
      },
      omit: {
        password: true
      }
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }


  // findFirst : comme findUnique mais pour un champ qui n'est pas marqué @unique dans Prisma. Retourne le premier résultat trouvé
  async findOneByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { resetPasswordToken: token }
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
    const {role, ...safeData} = updateUser

    return this.prisma.user.update({
      where: { id },
      data: safeData

    });
  }



  async updateRole(id: number, role: RoleEnum): Promise<User> {
    return this.prisma.user.update({
      where: {id},
      data: {role}
    })
  }


  async remove(id: number): Promise<void> {

    await this.prisma.user_has_Skill.deleteMany({ where: { userId: id } })
    await this.prisma.user_Has_Mission.deleteMany({ where: { userId: id } })
    await this.prisma.notification.deleteMany({ where: { userId: id } })

    const deleteUser: User = await this.prisma.user.delete({ where: { id } });

    return
  }



}
