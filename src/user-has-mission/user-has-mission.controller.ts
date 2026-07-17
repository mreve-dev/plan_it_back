import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserHasMissionService } from './user-has-mission.service';
import { CreateUserHasMissionDto } from './dto/create-user-has-mission.dto';
import { UpdateUserHasMissionDto } from './dto/update-user-has-mission.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user-has-mission')
export class UserHasMissionController {
  constructor(private readonly userHasMissionService: UserHasMissionService) { }

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


  // Retourne le total d'heures de bénévolat du user connecté pour le mois en cours.
  // Comme pour myslots, on utilise req.user.id (extrait du JWT côté serveur) et jamais 
  // un id passé par le front, pour qu'un user ne puisse jamais consulter les heures de quelqu'un d'autre.
  @UseGuards(AuthGuard)
  @Get('myhours')
  getMyHours(@Req() req) {
    return this.userHasMissionService.getVolunteerHoursThisMonth(req.user.id);
  }



  @UseGuards(AuthGuard)
  @Delete(':slotId/user/:userId')
  remove(@Param('slotId') slotId: string, @Param('userId') userId: string, @Req() req) {
    return this.userHasMissionService.remove(+slotId, +userId, req.user.id, req.user.role);
  }
}
