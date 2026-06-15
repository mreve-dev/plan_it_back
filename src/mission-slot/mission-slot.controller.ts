import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MissionSlotService } from './mission-slot.service';
import { CreateMissionSlotDto } from './dto/create-mission-slot.dto';
import { UpdateMissionSlotDto } from './dto/update-mission-slot.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/guard/decorators/roles.decorator';

@Controller('mission-slot')
export class MissionSlotController {
  constructor(private readonly missionSlotService: MissionSlotService) {}

  
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createMissionSlotDto: CreateMissionSlotDto) {
    return this.missionSlotService.create(createMissionSlotDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.missionSlotService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionSlotService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionSlotDto: UpdateMissionSlotDto, @Req() req) {
    return this.missionSlotService.update(+id, updateMissionSlotDto, req.user.id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionSlotService.remove(+id);
  }
}
