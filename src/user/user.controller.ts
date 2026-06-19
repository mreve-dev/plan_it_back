import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleEnum, User } from 'prisma/generated/prisma/client';
import { OnBoarding } from './dto/onBoarding.dto';
import { UserWTPwd } from './interface/userWTPwd.interface';
import { Roles } from 'src/auth/guard/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UpdateRoleDto } from './dto/update-role.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req) : Promise<(UserWTPwd | Omit<UserWTPwd, 'email'>)[]> {
    return this.userService.findAll(req.user.role);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) : Promise<UserWTPwd | null> {
    return this.userService.findOne(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) : Promise<UserWTPwd | Omit<UserWTPwd, 'email'> |null> {
    return this.userService.findOneFiltered(+id, req.user.role);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Req() req, @Body() updateUser: UpdateUserDto) : Promise<User> {
    return this.userService.update(req.user.id, updateUser);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto): Promise<User> {
    return this.userService.updateRole(+id, body.role)
  }

  @UseGuards(AuthGuard)
  @Patch('onboarding')
  async updateSkillsFirstConnexion(@Req() req, @Body() updateUser: OnBoarding) : Promise<User> {
    
    console.log(req.user.id);
    
    
    return this.userService.onboarding(req.user.id, updateUser);
  }


  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) : Promise<void>{

    if(req.user.role !== 'admin' && req.user.id !== +id) {
      throw new UnauthorizedException('Action non autorisée')
    }
    return this.userService.remove(+id);
  }
}

