import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() : Promise<User| null> {
    return this.userService.findAll();
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

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<void>{
    return this.userService.remove(+id);
  }
}

