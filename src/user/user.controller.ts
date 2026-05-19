import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req } from '@nestjs/common';
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
    return this.userService.findOne(req.user)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<User | null> {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Req() req, @Body() updateUser: UpdateUserDto) : Promise<User> {
    return this.userService.update(req.user, updateUser);
  }

  @UseGuards(AuthGuard)
  @Patch('onboarding')
  async updateSkillsFirstConnexion(@Req() req, @Body() updateUser: OnBoarding) : Promise<User> {
    
    console.log(req.user);
    
    
    return this.userService.onboarding(req.user, updateUser);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<void>{
    return this.userService.remove(+id);
  }
}

