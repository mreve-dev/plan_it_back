import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Roles } from 'src/auth/guard/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createMissionDto: CreateMissionDto, @Req() req) {
    return this.missionService.create(createMissionDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto, @Req() req) {
    return this.missionService.update(+id, updateMissionDto, req.user.id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}
