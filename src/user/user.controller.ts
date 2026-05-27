import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'prisma/generated/prisma/client';
import { OnBoarding } from './dto/onBoarding.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() : Promise<User[] | null> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) : Promise<User | null> {
    return this.userService.findOne(req.user.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<User | null> {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Req() req, @Body() updateUser: UpdateUserDto) : Promise<User> {
    return this.userService.update(req.user.id, updateUser);
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

