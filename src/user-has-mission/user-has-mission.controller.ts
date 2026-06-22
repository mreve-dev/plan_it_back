import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserHasMissionService } from './user-has-mission.service';
import { CreateUserHasMissionDto } from './dto/create-user-has-mission.dto';
import { UpdateUserHasMissionDto } from './dto/update-user-has-mission.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user-has-mission')
export class UserHasMissionController {
  constructor(private readonly userHasMissionService: UserHasMissionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserHasMissionDto: CreateUserHasMissionDto, @Req() req) {
    return this.userHasMissionService.create(createUserHasMissionDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/myslots')
  findAllByUser(@Req() req) {
    return this.userHasMissionService.findAllByUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('slots/:slotId')
  findAllBySlot(@Param('slotId') slotId: string) {
    return this.userHasMissionService.findAllBySlot(+slotId);
  }

  @UseGuards(AuthGuard)
  @Delete(':slotId/user/:userId')
  remove(@Param('slotId') slotId: string,@Param('userId') userId: string, @Req() req) {
    return this.userHasMissionService.remove(+slotId, +userId, req.user.id, req.user.role);
  }
}
